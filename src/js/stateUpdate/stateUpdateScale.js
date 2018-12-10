const getStateUpdateScale = ({ components }) => function updateScale() {
  const {
    layout,
    msaAtlas,
    censusDropdown,
    distanceDropdown,
    histogram,
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

  histogram
    .config({
      currentScale: scale,
    });

  if (scale === 'national') {
    histogram.updateData();
  }
};

export default getStateUpdateScale;
