const getStateUpdateScale = ({ components }) => function updateScale() {
  const {
    layout,
    atlas,
    msaAtlas,
    censusDropdown,
    distanceDropdown,
    histogram,
    sidebar,
    legend,
    zoomControls,
  } = components;

  const scale = this.get('scale');

  const legendOn = scale === 'national';

  zoomControls
    .config({
      currentScale: scale,
    });

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

  legend
    .config({ legendOn })
    .updateScale();

  histogram
    .config({
      currentScale: scale,
      legendOn,
    })
    .setLegendStatus()
    .updateSize();


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

    atlas.setZoom();

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
