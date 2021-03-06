import * as topojson from 'topojson-client';

const filterGeoByDistance = ({
  cachedTractGeoJSON,
  msa,
  years,
  distanceFilter,
  censusField,
  taFilter,
}) => {
  const tractGeo = cachedTractGeoJSON.get(`${msa.msaId}-${years[0]}-${years[1]}`);

  const tractGeoFiltered = Object.assign({}, tractGeo);
  tractGeoFiltered.features = tractGeo.features.filter((d) => {
    const isDefined = d.properties[censusField.id] !== null
      && d.properties[censusField.id] !== undefined;
    let inDistance = true;
    if (distanceFilter) {
      const tas = d.properties[`i${distanceFilter.value * 1000}`];
      if (!tas) {
        // not in distance of any TA's stop
        inDistance = false;
      } else if (taFilter.size) {
        // only within distance of a stop with unknown TA
        if (tas.length === 1 && +tas[0] === 9999) inDistance = false;
        // only within distance of filtered-out stops
        if (tas.filter(ta => +ta !== 9999).every(ta => taFilter.has(`${ta}`))) inDistance = false;
      }
    }
    return isDefined && inDistance;
  });

  return tractGeoFiltered;
};

const processGeoJSON = ({
  years,
  msa,
  updateComponents,
  distanceFilter,
  data,
  censusField,
  taFilter,
}) => {
  const cachedTractData = data.get('cachedTractData');
  const { censusData, tractTopo, regionData } = cachedTractData.get(msa.msaId);
  const tractGeoRaw = topojson.feature(
    tractTopo,
    tractTopo.objects[`tract-${msa.msaId}`],
  );

  const cachedTractGeoJSON = data.get('cachedTractGeoJSON');
  const cachedMSACensus = data.get('cachedMSACensus');
  const getCensusTable = ({ year, dataObj }) => dataObj.rows
    .filter(d => d.year === year)
    .reduce((accumulator, census) => {
      accumulator[String(census.geoid)] = census;
      return accumulator;
    }, {});

  const yearRange = data.get('msaYearRange');

  const censusFields = data.get('censusFields');

  const tables = {};
  for (let year = yearRange[0]; year <= yearRange[1]; year += 1) {
    tables[year] = getCensusTable({
      year,
      dataObj: censusData,
    });
  }

  const regionTables = {};
  for (let year = yearRange[0]; year <= yearRange[1]; year += 1) {
    regionTables[year] = getCensusTable({
      year,
      dataObj: regionData,
    });
  }

  const regionCensusChange = censusFields
    .reduce((accumulator, field) => {
      const changeKey = `${field.value}_change`;
      const value1 = regionTables[years[0]][msa.msaId] ? regionTables[years[0]][msa.msaId][field.value] : null;
      const value2 = regionTables[years[1]][msa.msaId] ? regionTables[years[1]][msa.msaId][field.value] : null;

      if (value1 && value2) {
        if (field.unit === '%') {
          accumulator[changeKey] = value2 - value1;
        } else {
          accumulator[changeKey] = (value2 - value1)
          / value1;
        }
      } else {
        accumulator[changeKey] = null;
      }
      // nominal values of start and end year
      accumulator[`${field.id}0`] = value1; // first year
      accumulator[field.id] = value2; // second ("current") year
      accumulator[`${field.id}-actualyears`] = years;
      // actual nominal value of current year, even if null
      accumulator[`${field.value}-nominal`] = regionTables[years[1]][msa.msaId] ? regionTables[years[1]][msa.msaId][field.value] : null;
      return accumulator;
    }, {});

  const table1 = getCensusTable({
    year: years[0],
    dataObj: censusData,
  });

  const table2 = getCensusTable({
    year: years[1],
    dataObj: censusData,
  });

  const valueColorScales = censusFields.reduce((obj, field) => {
    const colors = data.get('valueColorScale').range();
    const currentFieldValues = Object.values(table2).map(d => d[field.value]);
    const scale = d3.scaleQuantile().domain(currentFieldValues).range(colors);
    return { ...obj, [field.value]: scale };
  }, {});

  const tractGeo = Object.assign({}, tractGeoRaw);
  tractGeo.features = tractGeoRaw.features.map((feature, i) => {
    const featureCopy = Object.assign({}, feature);
    featureCopy.properties = Object.assign({}, feature.properties);

    const census1 = table1[feature.properties.id];
    const census2 = table2[feature.properties.id];

    featureCopy.properties[`census${years[0]}`] = census1;
    featureCopy.properties[`census${years[1]}`] = census2;
    if (census1 === undefined || census2 === undefined) {
      return featureCopy;
    }
    const changeColorScale = data.get('changeColorScale');

    const noDataColor = data.get('noDataColor');

    const censusChange = censusFields
      .reduce((accumulator, field) => {
        const changeKey = `${field.value}_change`;
        const value1 = census1[field.value];
        const value2 = census2[field.value];
        if (value1 && value2) {
          if (field.unit === '%') {
            accumulator[changeKey] = value2 - value1;
          } else {
            accumulator[changeKey] = (value2 - value1)
            / value1;
          }
          const color = changeColorScale(accumulator[changeKey] * 100);
          accumulator[`${changeKey}-color`] = color;
        } else {
          accumulator[changeKey] = null;
          accumulator[`${changeKey}-color`] = noDataColor;
        }
        // nominal values of start and end year
        accumulator[`${field.id}0`] = value1; // first year
        accumulator[field.id] = value2; // second ("current") year
        accumulator[`${field.id}-actualyears`] = years;
        // actual nominal value of current year, even if null
        accumulator[`${field.value}-nominal`] = census2[field.value];
        if (census2[field.value] !== null) {
          accumulator[`${field.id}-color`] = valueColorScales[field.value](value2);
        } else {
          accumulator[`${field.id}-color`] = noDataColor;
        }
        return accumulator;
      }, {});
    Object.assign(featureCopy.properties, censusChange, { fill: 'red' });
    return featureCopy;
  });

  cachedTractGeoJSON.set(`${msa.msaId}-${years[0]}-${years[1]}`, tractGeo);
  cachedMSACensus.set(`${msa.msaId}-${years[0]}-${years[1]}`, regionCensusChange);

  const tractGeoFiltered = filterGeoByDistance({
    cachedTractGeoJSON,
    msa,
    years,
    distanceFilter,
    censusField,
    taFilter,
  });

  updateComponents(tractGeoFiltered, regionCensusChange);
};

const loadTractData = ({
  msa,
  distanceFilter,
  updateComponents,
  censusField,
  data,
  years,
  taFilter,
}) => {
  Promise.all([
    d3.json(`data/tracts/tract-${msa.msaId}.json`),
    d3.json(`https://transitcenter-admin.carto.com/api/v2/sql?q=${encodeURIComponent(`SELECT * FROM census WHERE msaid = ${msa.msaId}`)}`),
    d3.json(`https://transitcenter-admin.carto.com/api/v2/sql?q=${encodeURIComponent(`SELECT * FROM census_msa WHERE geoid = ${msa.msaId}`)}`),
  ]).then((rawData) => {
    const [tractTopo, censusData, regionData] = rawData;
    const cachedTractData = data.get('cachedTractData');
    cachedTractData.set(msa.msaId, { tractTopo, censusData, regionData });
    processGeoJSON({
      distanceFilter,
      years,
      msa,
      updateComponents,
      censusField,
      data,
      taFilter,
    });
  });
};

const getCurrentTractData = ({
  msa,
  years,
  updateComponents,
  censusField,
  data,
  distanceFilter,
  taFilter,
}) => {
  const cachedTractGeoJSON = data.get('cachedTractGeoJSON');
  const cachedMSACensus = data.get('cachedMSACensus');
  const cachedTractData = data.get('cachedTractData');
  if (cachedTractGeoJSON.has(`${msa.msaId}-${years[0]}-${years[1]}`)) {
    const tractGeoFiltered = filterGeoByDistance({
      cachedTractGeoJSON,
      msa,
      censusField,
      years,
      distanceFilter,
      taFilter,
    });
    const regionCensus = cachedMSACensus.get(`${msa.msaId}-${years[0]}-${years[1]}`);
    updateComponents(tractGeoFiltered, regionCensus);
  } else if (cachedTractData.has(msa.msaId)) {
    processGeoJSON({
      years,
      msa,
      updateComponents,
      censusField,
      data,
      distanceFilter,
      taFilter,
    });
  } else {
    loadTractData({
      msa,
      updateComponents,
      censusField,
      data,
      years,
      distanceFilter,
      taFilter,
    });
  }
};

const getGetCurrentTractGeo = ({ data }) => function getCurrentTractGeo(updateComponents) {
  const msa = this.get('msa');
  const years = this.get('years');
  const censusField = this.get('censusField');
  const distanceFilter = this.get('distanceFilter');
  const taFilter = this.get('taFilter');
  getCurrentTractData({
    msa,
    years,
    updateComponents,
    censusField,
    data,
    distanceFilter,
    taFilter,
  });
};

export default getGetCurrentTractGeo;
