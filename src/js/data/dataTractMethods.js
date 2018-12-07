import * as topojson from 'topojson-client';

const processGeoJSON = ({
  years,
  msa,
  updateComponents,
  data,
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
    const censusFields = data.get('censusFields');

    const censusChange = censusFields
      .reduce((accumulator, field) => {
        if (census1[field.value] !== 0) {
          accumulator[field.value] = (census2[field.value] - census1[field.value])
          / census1[field.value];
          const color = changeColorScale(accumulator[field.value] * 100);
          accumulator[`${field.value}-color`] = color;
        } else {
          accumulator[field.value] = null;
          accumulator[`${field.value}-color`] = null;
        }

        return accumulator;
      }, {});
    Object.assign(featureCopy.properties, censusChange, { fill: 'red' });
    return featureCopy;
  });
  cachedTractGeoJSON.set(`${msa.msaId}-${years[0]}-${years[1]}`, tractGeo);

  updateComponents();
};

const loadTractData = ({
  msa,
  updateComponents,
  data,
  years,
}) => {
  Promise.all([
    d3.json(`data/tracts/tract-${msa.msaId}.json`),
    d3.json(`https://ridership.carto.com/api/v2/sql?q=${encodeURIComponent(`SELECT * FROM census WHERE msaid = ${msa.msaId}`)}`),
  ]).then((rawData) => {
    const [tractTopo, censusData] = rawData;
    const cachedTractData = data.get('cachedTractData');
    cachedTractData.set(msa.msaId, { tractTopo, censusData });
    processGeoJSON({
      years,
      msa,
      updateComponents,
      data,
    });
  });
};

const updateTractData = ({
  msa,
  years,
  updateComponents,
  data,
}) => {
  const cachedTractGeoJSON = data.get('cachedTractGeoJSON');
  const cachedTractData = data.get('cachedTractData');
  if (cachedTractGeoJSON.has(`${msa.msaId}-${years[0]}-${years[1]}`)) {
    updateComponents();
  } else if (cachedTractData.has(msa.msaId)) {
    processGeoJSON({
      years,
      msa,
      updateComponents,
      data,
    });
  } else {
    loadTractData({
      msa,
      updateComponents,
      data,
      years,
    });
  }
};

export default updateTractData;
