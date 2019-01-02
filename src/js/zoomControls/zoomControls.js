const privateProps = new WeakMap();

const privateMethods = {
  setClickListeners() {
    const {
      zoomInButton,
      zoomOutButton,
      onZoomIn,
      onZoomOut,
    } = privateProps.get(this);
    zoomInButton
      .on('click', onZoomIn);

    zoomOutButton
      .on('click', onZoomOut);
  },
};

class ZoomControls {
  constructor(config) {
    const {
      setClickListeners,
    } = privateMethods;
    privateProps.set(this, {});
    this.config(config);

    setClickListeners.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  updateCurrentZoom() {
    const {
      currentZoom,
    } = privateProps.get(this);
    console.log('currentZoom', currentZoom);
  }
}

export default ZoomControls;
