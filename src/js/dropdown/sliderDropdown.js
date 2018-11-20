import getPrivateBase from './dropdownPrivateBase';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    // const {
    // } = privateProps.get(this);
    const {
      setMenuToggleEvents,
      setContentVisibility,
    } = privateMethods;

    setMenuToggleEvents.call(this);
    setContentVisibility.call(this);
  },
};

class SliderDropdown {
  constructor(config) {
    const {
      init,
    } = privateMethods;
    privateProps.set(this, {
      dropdownOpen: true,
    });

    this.config(config);

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

export default SliderDropdown;
