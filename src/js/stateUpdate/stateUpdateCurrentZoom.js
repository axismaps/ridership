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
  console.log('zoom?', currentZoom);
};

export default getStateUpdateCurrentZoom;
