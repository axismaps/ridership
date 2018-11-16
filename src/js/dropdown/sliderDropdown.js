import getPublicBase from './dropdownPublicBase';
import getPrivateBase from './dropdownPrivateBase';

const privateProps = new WeakMap();

const privateMethods = {};

class SliderDropdown {
  constructor(config) {
    privateProps.set(this, {});
    this.config(config);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  update() {
    console.log('update', this);
  }
}

Object.assign(
  privateMethods,
  getPrivateBase({ privateProps, privateMethods }),
);

Object.assign(
  SliderDropdown.prototype,
  getPublicBase({ privateProps, privateMethods }),
);

export default SliderDropdown;
