const updateComponents = ({
  layout,
  msa,
  scale,
  tractTopo,
}) => {
  layout
    .config({
      scale,
    })
    .updateScale();
  // atlas
  //   .config({
  //     scale,
  //     msa,
  //     tractTopo,
  //   })
  //   .updateScale();
};

const getStateUpdateScale = ({ components, data }) => function updateScale() {
  const {
    atlas,
    layout,
  } = components;

  const scale = this.get('scale');
  if (scale === 'msa') {
    const msa = this.get('msa');

    const cachedTractGeoJSON = data.get('cachedTractGeoJSON');

    if (cachedTractGeoJSON.has(msa.msaId)) {
      const tractTopo = cachedTractGeoJSON.get(msa.msaId);
      updateComponents({
        layout,
        msa,
        scale,
        tractTopo,
      });
    } else {
      d3.json(`data/tracts/tract-${msa.msaId}.json`)
        .then((tractTopo) => {
          cachedTractGeoJSON.set(msa.msaId, tractTopo);
          updateComponents({
            layout,
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
