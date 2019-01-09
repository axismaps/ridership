const getStateUpdateMSAScaleExtent = ({ components }) => function stateUpdateMSAScaleExtent() {
  const msaScaleExtent = this.get('msaScaleExtent');
  const { zoomControls, msaAtlas } = components;

  zoomControls
    .config({
      msaScaleExtent,
    })
    .updateCurrentZoom();

  msaAtlas
    .config({
      scaleExtent: msaScaleExtent,
    })
    .updateExtents();
};

export default getStateUpdateMSAScaleExtent;
