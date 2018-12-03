const getStateUpdateScale = ({ components, data }) => function updateScale() {
  const {
    atlas,
  } = components;

  const scale = this.get('scale');
  if (scale === 'msa') {
    const msa = this.get('msa');

    const cachedTractGeoJSON = data.get('cachedTractGeoJSON');
    console.log('MSA?!?', msa);
    if (cachedTractGeoJSON.has(msa.msaId)) {
      const tractTopo = cachedTractGeoJSON.get(msa.msaId);
      console.log('has tract', tractTopo);
    } else {
      d3.json(`data/tracts/tract-${msa.msaId}.json`)
        .then((tractTopo) => {
          console.log('new TRACT', tractTopo);
          cachedTractGeoJSON.set(msa.msaId, tractTopo);
        })
        .catch((err) => {
          console.log('TRACT NOT FOUND', err);
        });
    }
  }
};

export default getStateUpdateScale;
