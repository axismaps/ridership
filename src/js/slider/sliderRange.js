import getSliderBase from './sliderBase';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    // const props = privateProps.get(this);
    const {
      setScale,
    } = privateMethods;

    setScale.call(this);
  },
};

class slider {
  constructor(config) {
    privateProps.set(this, {

    });

    const {
      init,
    } = privateMethods;

    this.config(config);

    init.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
}

Object.assign(
  privateMethods,
  getSliderBase({ privateMethods, privateProps }),
);

export default slider;
