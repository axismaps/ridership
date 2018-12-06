import * as topojson from 'topojson-client';

const updateComponents = ({
  components,
  data,
  msa,
}) => {
  const {
    msaAtlas,
  } = components;

  const cachedTractGeoJSON = data.get('cachedTractGeoJSON');

  const tractGeo = cachedTractGeoJSON.get(msa.msaId);
  msaAtlas
    .config({
      msa,
      tractGeo,
    })
    .updateMSA();
};

const censusFields = [
  {
    name: 'Percentage Asian',
    value: 'asian_pct',
  },
  {
    name: 'Percentage Black',
    value: 'black_pct',
  },
  {
    name: 'Percentage Latino',
    value: 'latino_pct',
  },
  {
    name: 'Percentage White',
    value: 'white_pct',
  },
  {
    name: 'Percentage Foreign born',
    value: 'foreign_pct',
  },
  {
    name: 'Population over 75',
    value: 'over75',
  },
  {
    name: 'Population',
    value: 'pop',
  },
  {
    name: 'Income',
    value: 'income',
  },
];

const loadTractData = ({
  msa,
  components,
  data,
  years,
}) => {
  console.log('years', years);
  const cachedTractGeoJSON = data.get('cachedTractGeoJSON');
  const getCensusTable = ({ censusData, year }) => censusData.rows
    .filter(d => d.year === year)
    .reduce((accumulator, census) => {
      accumulator[String(census.geoid)] = census;
      return accumulator;
    }, {});

  Promise.all([
    d3.json(`data/tracts/tract-${msa.msaId}.json`),
    d3.json(`https://ridership.carto.com/api/v2/sql?q=${encodeURIComponent(`SELECT * FROM census WHERE msaid = ${msa.msaId}`)}`),
  ]).then((rawData) => {
    const [tractTopo, censusData] = rawData;
    // censusData.rows.forEach((d) => {
    //   console.log('years', d.year, years[0]);
    // });
    // console.log('censusData', censusData
    //   .rows.filter(d => d.year === years[0]));
    const tractGeoRaw = topojson.feature(
      tractTopo,
      tractTopo.objects[`tract-${msa.msaId}`],
    );
    // const censusTable = censusData.rows.reduce((accumulator, census) => {
    //   accumulator[String(census.geoid)] = census;
    //   return accumulator;
    // }, {});
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
      const censusChange = censusFields
        .reduce((accumulator, field) => {
          if (census1[field.value] !== 0) {
            accumulator[field.value] = (census2[field.value] - census1[field.value])
            / census1[field.value];
          } else {
            accumulator[field.value] = null;
          }

          return accumulator;
        }, {});
      Object.assign(featureCopy.properties, censusChange);
      // const census = censusData.rows.find(d => String(d.geoid) === feature.properties.id);
      // const census = censusTable[feature.properties.id];
      // if (census !== undefined) {
      //   Object.assign(featureCopy.properties, census);
      // }
      return featureCopy;
    });
    cachedTractGeoJSON.set(msa.msaId, tractGeo);

    updateComponents({
      msa,
      components,
      data,
    });
  });
};

const getStateUpdateMSA = ({ components, data }) => function updateMSA() {
  const cachedTractGeoJSON = data.get('cachedTractGeoJSON');
  const msa = this.get('msa');
  const years = this.get('years');

  if (cachedTractGeoJSON.has(msa.msaId)) {
    updateComponents.call(this, { components, data });
  } else {
    // d3.json(`data/tracts/tract-${msa.msaId}.json`)
    //   .then((tractTopo) => {
    //     cachedTractGeoJSON.set(msa.msaId, tractTopo);
    //     updateComponents.call(this, { components, data });
    //   });
    loadTractData({
      msa,
      components,
      data,
      years,
    });
  }
};

export default getStateUpdateMSA;
