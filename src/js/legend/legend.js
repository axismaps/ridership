const privateProps = new WeakMap();

const privateMethods = {};

class Legend {
  constructor(config) {
    privateProps.set(this, {

    });
    this.config(config);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
}

export default Legend;
