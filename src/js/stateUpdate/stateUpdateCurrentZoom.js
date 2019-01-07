const getStateUpdateCurrentZoom = ({ components }) => function updateCurrentZoom() {
  const {
    zoomControls,
  } = components;
  const currentZoom = this.get('currentZoom');

  zoomControls
    .config({
      currentZoom,
    })
    .updateCurrentZoom();
};

export default getStateUpdateCurrentZoom;
