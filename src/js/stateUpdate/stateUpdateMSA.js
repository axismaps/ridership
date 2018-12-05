const updateComponents = function updateComponents({
  components,
  data,
}) {
  const {
    msaAtlas,
  } = components;
  const msa = this.get('msa');

  const cachedTractGeoJSON = data.get('cachedTractGeoJSON');

  const tractTopo = cachedTractGeoJSON.get(msa.msaId);
  msaAtlas
    .config({
      msa,
      tractTopo,
    })
    .updateMSA();
};

const getStateUpdateMSA = ({ components, data }) => function updateMSA() {
  const cachedTractGeoJSON = data.get('cachedTractGeoJSON');
  const msa = this.get('msa');

  if (cachedTractGeoJSON.has(msa.msaId)) {
    updateComponents.call(this, { components, data });
  } else {
    d3.json(`data/tracts/tract-${msa.msaId}.json`)
      .then((tractTopo) => {
        cachedTractGeoJSON.set(msa.msaId, tractTopo);
        updateComponents.call(this, { components, data });
      });
  }
};

export default getStateUpdateMSA;
