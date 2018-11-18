import getPublicBase from './dropdownPublicBase';
import getPrivateBase from './dropdownPrivateBase';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const {
      indicators,
      // contentContainer,
    } = privateProps.get(this);
    const {
      setToggleButtonClick,
    } = privateMethods;

    setToggleButtonClick.call(this);
    console.log('indicators', indicators);
  },
};

class IndicatorDropdown {
  constructor(config) {
    const {
      init,
    } = privateMethods;
    privateProps.set(this, {
      dropdownOpen: true,
    });
    this.config(config);
    console.log('test');
    init.call(this);
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
  IndicatorDropdown.prototype,
  getPublicBase({ privateProps, privateMethods }),
);

export default IndicatorDropdown;
