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
};

class Layout {
  constructor(config) {
    const {
      initBackButtonListener,
    } = privateMethods;
    privateProps.set(this, {});
    this.config(config);
    this.updateScale();

    initBackButtonListener.call(this);
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
}

export default Layout;
