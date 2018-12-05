const privateProps = new WeakMap();

class Layout {
  constructor(config) {
    privateProps.set(this, {});
    this.config(config);
    this.updateScale();
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
