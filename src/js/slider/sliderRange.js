import getSliderBase from './sliderBase';

const privateProps = new WeakMap();

const privateMethods = {

};

class slider {
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

Object.assign(
  privateMethods,
  getSliderBase({ privateMethods, privateProps }),
);

export default slider;
