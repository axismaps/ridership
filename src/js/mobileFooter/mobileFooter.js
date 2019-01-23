const privateProps = new WeakMap();

const privateMethods = {};

class MobileFooter {
  constructor(config) {
    privateProps.set(this, {});
    this.config(config);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
}

export default MobileFooter;
