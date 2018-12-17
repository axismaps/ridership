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
  sidebar
    .config({
      currentScale: scale,
    });

  if (scale === 'national') {
    histogram.updateData();
    sidebar
      .config({
        indicatorSummaries: this.getCurrentIndicatorSummaries(),
        agenciesData: this.getCurrentAgenciesData(),
        currentIndicatorDisabled: false,
      })
      .updateCurrentIndicator()
      .updateData();
    this.update({
      taFilter: new Set(),
    });
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
