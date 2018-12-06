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

const loadTractData = ({
  msa,
  components,
  data,
}) => {
  const cachedTractGeoJSON = data.get('cachedTractGeoJSON');
  Promise.all([
    d3.json(`data/tracts/tract-${msa.msaId}.json`),
    d3.json(`https://ridership.carto.com/api/v2/sql?q=${encodeURIComponent(`SELECT * FROM census WHERE msaid = ${msa.msaId}`)}`),
  ]).then((rawData) => {
    const [tractTopo, censusData] = rawData;
    const tractGeoRaw = topojson.feature(
      tractTopo,
      tractTopo.objects[`tract-${msa.msaId}`],
    );
    const censusTable = censusData.rows.reduce((accumulator, census) => {
      accumulator[String(census.geoid)] = census;
      return accumulator;
    }, {});

    const tractGeo = Object.assign({}, tractGeoRaw);
    tractGeo.features = tractGeoRaw.features.map((feature) => {
      const featureCopy = Object.assign({}, feature);
      featureCopy.properties = Object.assign({}, feature.properties);
      // const census = censusData.rows.find(d => String(d.geoid) === feature.properties.id);
      const census = censusTable[feature.properties.id];
      if (census !== undefined) {
        Object.assign(featureCopy.properties, census);
      }
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
    });
  }
};

export default getStateUpdateMSA;
