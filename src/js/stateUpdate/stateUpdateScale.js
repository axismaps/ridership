import setAllDropdownPositions from '../dropdown/setDropdownPositions';

const getStateUpdateScale = ({ components, data }) => function updateScale() {
  const {
    layout,
    atlas,
    msaAtlas,
    histogram,
    sidebar,
    legend,
    zoomControls,
    sliderDropdown,
  } = components;

  const scale = this.get('scale');

  // const legendOn = scale === 'national';

  sliderDropdown
    .config({
      yearRange: scale === 'national' ? data.get('yearRange') : data.get('msaYearRange'),
    })
    .updateYearRange();

  zoomControls
    .config({
      currentScale: scale,
    });

  layout
    .config({
      scale,
    })
    .updateScale();

  msaAtlas
    .config({
      scale,
    });

  legend
  //   .config({ legendOn })
    .updateScale();

  histogram
    .config({
      currentScale: scale,
      msa: null,
      // legendOn,
    })
    // .setLegendStatus()
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
      msa: null,
    });
  }

  if (scale === 'msa') {
    sidebar
      .config({
        currentIndicatorDisabled: true,
      })
      .updateCurrentIndicator();
  }

  setAllDropdownPositions({ components });
};

export default getStateUpdateScale;
