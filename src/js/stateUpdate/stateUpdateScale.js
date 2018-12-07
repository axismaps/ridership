const getStateUpdateScale = ({ components }) => function updateScale() {
  const {
    layout,
    msaAtlas,
    censusDropdown,
    distanceDropdown,
  } = components;

  const scale = this.get('scale');

  layout
    .config({
      scale,
    })
    .updateScale();

  censusDropdown
    .resetMenuPosition();

  distanceDropdown
    .resetMenuPosition();

  msaAtlas
    .config({
      scale,
    });
};

export default getStateUpdateScale;
