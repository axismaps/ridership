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
      if (!tas || !tas.filter(ta => +ta !== 9999).length) {
        // not within distance of any stops
        inDistance = false;
      } else if (taFilter.size && tas.filter(ta => +ta !== 9999).every(ta => taFilter.has(`${ta}`))) {
        // only within distance of filtered-out stops
        inDistance = false;
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
  const { censusData, tractTopo } = cachedTractData.get(msa.msaId);
  const tractGeoRaw = topojson.feature(
    tractTopo,
    tractTopo.objects[`tract-${msa.msaId}`],
  );

  const cachedTractGeoJSON = data.get('cachedTractGeoJSON');
  const getCensusTable = ({ year }) => censusData.rows
    .filter(d => d.year === year)
    .reduce((accumulator, census) => {
      accumulator[String(census.geoid)] = census;
      return accumulator;
    }, {});

  const table1 = getCensusTable({
    year: years[0],
    censusData,
  });

  const table2 = getCensusTable({
    year: years[1],
    censusData,
  });

  const censusFields = data.get('censusFields');
  const valueColorScales = censusFields.reduce((obj, field) => {
    const colors = data.get('valueColorScale').range();
    const currentFieldValues = Object.values(table2).map(d => d[field.value]);
    const scale = d3.scaleQuantile().domain(currentFieldValues).range(colors);
    return { ...obj, [field.value]: scale };
  }, {});

  const tractGeo = Object.assign({}, tractGeoRaw);
  tractGeo.features = tractGeoRaw.features.map((feature) => {
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
        if (field.unit === '%' || census1[field.value] !== 0) {
          if (field.unit === '%') {
            accumulator[changeKey] = census2[field.value] - census1[field.value];
          } else {
            accumulator[changeKey] = (census2[field.value] - census1[field.value])
            / census1[field.value];
          }
          const color = changeColorScale(accumulator[changeKey] * 100);
          accumulator[`${changeKey}-color`] = color;
        } else {
          accumulator[changeKey] = null;
          accumulator[`${changeKey}-color`] = null;
        }
        accumulator[`${field.id}0`] = census1[field.value]; // nominal value of first year
        // nominal value of second (considered the current) year
        accumulator[field.id] = census2[field.value];
        accumulator[`${field.id}-color`] = valueColorScales[field.value](census2[field.value]);


        return accumulator;
      }, {});
    Object.assign(featureCopy.properties, censusChange, { fill: 'red' });
    return featureCopy;
  });
  cachedTractGeoJSON.set(`${msa.msaId}-${years[0]}-${years[1]}`, tractGeo);

  const tractGeoFiltered = filterGeoByDistance({
    cachedTractGeoJSON,
    msa,
    years,
    distanceFilter,
    censusField,
    taFilter,
  });

  updateComponents(tractGeoFiltered);
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
    d3.json(`https://ridership.carto.com/api/v2/sql?q=${encodeURIComponent(`SELECT * FROM census WHERE msaid = ${msa.msaId}`)}`),
  ]).then((rawData) => {
    const [tractTopo, censusData] = rawData;
    const cachedTractData = data.get('cachedTractData');
    cachedTractData.set(msa.msaId, { tractTopo, censusData });
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
    updateComponents(tractGeoFiltered);
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
