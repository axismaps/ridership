const privateProps = new WeakMap();

const privateMethods = {
  initBackButtonListener() {
    const {
      returnToNationalScale,
      backButton,
    } = privateProps.get(this);

    backButton
      .on('click', returnToNationalScale);
  },
  initClearDistanceButton() {
    const {
      clearDistanceFilter,
      clearDistanceButton,
    } = privateProps.get(this);
    clearDistanceButton
      .on('click', clearDistanceFilter);
  },
  initHistogramButtonListeners() {
    const {
      openHistogram,
      histogramButton,
      histogramBackButton,
      closeHistogram,
    } = privateProps.get(this);
    histogramButton
      .on('click', openHistogram);
    histogramBackButton
      .on('click', closeHistogram);
  },
  setEmbedStatus() {
    const {
      embedded,
      params,
      outerContainer,
    } = privateProps.get(this);

    outerContainer
      .classed('embed', embedded)
      .classed(`embed--${params.get('embed')}`, embedded);
  },
};

class Layout {
  constructor(config) {
    const {
      initBackButtonListener,
      initClearDistanceButton,
      initHistogramButtonListeners,
      setEmbedStatus,
    } = privateMethods;
    privateProps.set(this, {});
    this.config(config);
    this.updateScale();
    this.updateDistanceFilter();

    initBackButtonListener.call(this);
    initClearDistanceButton.call(this);
    initHistogramButtonListeners.call(this);
    setEmbedStatus.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  updateScale() {
    const {
      scale,
      outerContainer,
    } = privateProps.get(this);

    outerContainer
      .classed('outer-container--national', scale === 'national')
      .classed('outer-container--msa', scale === 'msa');
  }

  updateDistanceFilter() {
    const {
      distanceFilter,
      clearDistanceButton,
    } = privateProps.get(this);

    clearDistanceButton
      .classed('atlas__distance-dropdown-clear--hidden', distanceFilter === null);
  }

  updateSidebarToggle() {
    const {
      mobileSidebarOpen,
      outerContainer,
    } = privateProps.get(this);
    outerContainer.classed('outer-container--sidebar', mobileSidebarOpen);
  }

  updateHistogramToggle() {
    const {
      outerContainer,
      mobileHistogramOpen,
    } = privateProps.get(this);
    outerContainer
      .classed('outer-container--histogram', mobileHistogramOpen);
  }
}

export default Layout;
