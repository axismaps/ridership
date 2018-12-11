const getStateUpdateScale = ({ components }) => function updateScale() {
  const {
    layout,
    msaAtlas,
    censusDropdown,
    distanceDropdown,
    histogram,
    sidebar,
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
    sidebar
      .config({
        indicatorSummaries: this.getCurrentIndicatorSummaries(),
        currentIndicatorDisabled: false,
      })
      .updateCurrentIndicator()
      .updateData();
  }

  if (scale === 'msa') {
    sidebar
      .config({
        currentIndicatorDisabled: true,
      })
      .updateCurrentIndicator();
  }
};

export default getStateUpdateScale;
