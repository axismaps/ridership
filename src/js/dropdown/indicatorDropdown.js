import getPublicBase from './dropdownPublicBase';
import getPrivateBase from './dropdownPrivateBase';
import pureMethods from './indicatorDropdownMethods';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      indicators,
      contentContainer,
      contentOuterContainer,
      toggleButton,
      indicator,
      toggleButtonText,
    } = props;

    const {
      setMenuToggleEvents,
      setContentVisibility,
    } = privateMethods;

    const {
      drawContent,
      setButtonText,
      setContentPosition,
    } = pureMethods;

    setMenuToggleEvents.call(this);
    setContentVisibility.call(this);

    setButtonText({
      indicator,
      toggleButtonText,
    });

    setContentPosition({
      toggleButton,
      contentOuterContainer,
    });

    props.indicatorRows = drawContent({
      indicators,
      contentContainer,
    });
  },
};

class IndicatorDropdown {
  constructor(config) {
    const {
      init,
    } = privateMethods;
    privateProps.set(this, {
      dropdownOpen: false,
      toggleButton: d3.select('.atlas__indicator-dropdown-button'),
      toggleButtonText: d3.select('.atlas__indicator-dropdown-button-text'),
      contentOuterContainer: d3.select('.indicator-dropdown__content-container'),
      contentContainer: d3.select('.indicator-dropdown__content'),
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
