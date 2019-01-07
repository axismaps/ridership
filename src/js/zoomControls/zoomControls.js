const privateProps = new WeakMap();

const privateMethods = {
  setClickListeners() {
    const {
      zoomInButton,
      zoomOutButton,
      zoomBoundsButton,
      onZoomIn,
      onZoomOut,
      onZoomBounds,
    } = privateProps.get(this);
    zoomInButton
      .on('click', onZoomIn);

    zoomOutButton
      .on('click', onZoomOut);

    zoomBoundsButton
      .on('click', onZoomBounds);
  },
  updateButtonStatus() {
    const {
      zoomInButton,
      zoomOutButton,
      scaleExtent,
      currentZoom,
      currentScale,
    } = privateProps.get(this);

    const threshold = 0.0000001;
    const currentScaleExtent = scaleExtent[currentScale];
    zoomInButton
      .classed('atlas__zoom-button--disabled', () => currentScaleExtent[1] - currentZoom <= threshold);

    zoomOutButton
      .classed('atlas__zoom-button--disabled', () => currentZoom - currentScaleExtent[0] <= threshold);
  },
};

class ZoomControls {
  constructor(config) {
    const {
      setClickListeners,
      updateButtonStatus,
    } = privateMethods;
    privateProps.set(this, {});

    this.config(config);

    setClickListeners.call(this);
    updateButtonStatus.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  updateCurrentZoom() {
    const { updateButtonStatus } = privateMethods;
    updateButtonStatus.call(this);
  }
}

export default ZoomControls;
