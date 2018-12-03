const updateComponents = ({
  atlas,
  msa,
  scale,
  tractTopo,
}) => {
  atlas
    .config({
      scale,
      msa,
      tractTopo,
    })
    .updateScale();
};

const getStateUpdateScale = ({ components, data }) => function updateScale() {
  const {
    atlas,
  } = components;

  const scale = this.get('scale');
  if (scale === 'msa') {
    const msa = this.get('msa');

    const cachedTractGeoJSON = data.get('cachedTractGeoJSON');

    if (cachedTractGeoJSON.has(msa.msaId)) {
      const tractTopo = cachedTractGeoJSON.get(msa.msaId);
      updateComponents({
        atlas,
        msa,
        scale,
        tractTopo,
      });
    } else {
      d3.json(`data/tracts/tract-${msa.msaId}.json`)
        .then((tractTopo) => {
          cachedTractGeoJSON.set(msa.msaId, tractTopo);
          updateComponents({
            atlas,
            msa,
            scale,
            tractTopo,
          });
        })
        .catch((err) => {
          console.log('TRACT NOT FOUND', err);
        });
    }
  }
};

export default getStateUpdateScale;
