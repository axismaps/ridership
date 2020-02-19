import * as topojson from 'topojson-client';

const filterGeoByDistance = ({
  cachedTractGeoJSON,
  msa,
  years,
  distanceFilter,
  censusField,
}) => {
  const tractGeo = cachedTractGeoJSON.get(`${msa.msaId}-${years[0]}-${years[1]}`);

  const tractGeoFiltered = Object.assign({}, tractGeo);
  tractGeoFiltered.features = tractGeo.features.filter((d) => {
    const isDefined = d.properties[censusField.id] !== null
      && d.properties[censusField.id] !== undefined;
    const inDistance = distanceFilter === null ? true
      : d.properties.dist <= distanceFilter.value;
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

  const getNearestYearValue = (year, field, feature, tables, isFirstYear) => {
    let table = tables[year];
    let value = tables[year][feature.properties.id][field.value];
    let i = 1;
    let currentYear = year;
    while (value === null || value === undefined) {
      const increment = isFirstYear ? i : -i;
      currentYear = year + increment;
      table = tables[currentYear];
      if (table) {
        value = table[feature.properties.id][field.value];
        if (value) break;
      }

      currentYear = year - increment;
      table = tables[currentYear];
      if (table) {
        value = table[feature.properties.id][field.value];
      }

      if (isFirstYear && year + i >= years[1] && year - i < yearRange[0]) break;
      if (!isFirstYear && year - i <= years[0] && year + i > yearRange[1]) break;
      i += 1;
    }
    return {
      value,
      year: currentYear,
    };
  };

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
      const data1 = getNearestYearValue(years[0], field, { properties: { id: msa.msaId } }, regionTables, true);
      const data2 = getNearestYearValue(years[1], field, { properties: { id: msa.msaId } }, regionTables, false);
      const value1 = data1.value;
      const value2 = data2.value;
      const year1 = data1.year;
      const year2 = data2.year;
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
      // nominal values of start and end year, or nearest available
      accumulator[`${field.id}0`] = value1; // first year
      accumulator[field.id] = value2; // second ("current") year
      accumulator[`${field.id}-actualyears`] = [year1, year2];
      // actual nominal value of current year, even if null
      accumulator[`${field.value}-nominal`] = regionTables[years[1]][msa.msaId][field.value];
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

    const censusChange = censusFields
      .reduce((accumulator, field) => {
        const changeKey = `${field.value}_change`;
        const data1 = getNearestYearValue(years[0], field, feature, tables, true);
        const data2 = getNearestYearValue(years[1], field, feature, tables, false);
        const value1 = data1.value;
        const value2 = data2.value;
        const year1 = data1.year;
        const year2 = data2.year;
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
          accumulator[`${changeKey}-color`] = null;
        }
        // nominal values of start and end year, or nearest available
        accumulator[`${field.id}0`] = value1; // first year
        accumulator[field.id] = value2; // second ("current") year
        accumulator[`${field.id}-actualyears`] = [year1, year2];
        // actual nominal value of current year, even if null
        accumulator[`${field.value}-nominal`] = census2[field.value];
        if (census2[field.value] !== null) {
          accumulator[`${field.id}-color`] = valueColorScales[field.value](value2);
        } else {
          accumulator[`${field.id}-color`] = null;
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
}) => {
  Promise.all([
    d3.json(`data/tracts/tract-${msa.msaId}.json`),
    d3.json(`https://ridership.carto.com/api/v2/sql?q=${encodeURIComponent(`SELECT * FROM census WHERE msaid = ${msa.msaId}`)}`),
    d3.json(`https://ridership.carto.com/api/v2/sql?q=${encodeURIComponent(`SELECT * FROM census_msa WHERE geoid = ${msa.msaId}`)}`),
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
    });
  } else {
    loadTractData({
      msa,
      updateComponents,
      censusField,
      data,
      years,
      distanceFilter,
    });
  }
};

const getGetCurrentTractGeo = ({ data }) => function getCurrentTractGeo(updateComponents) {
  const msa = this.get('msa');
  const years = this.get('years');
  const censusField = this.get('censusField');
  const distanceFilter = this.get('distanceFilter');
  getCurrentTractData({
    msa,
    years,
    updateComponents,
    censusField,
    data,
    distanceFilter,
  });
};

export default getGetCurrentTractGeo;
