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
      updateIndicator,
    } = props;

    const {
      setMenuToggleEvents,
      setContentVisibility,

    } = privateMethods;

    const {
      drawContent,
      setButtonText,
      setContentPosition,
      highlightCurrentIndicator,
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

    const indicatorRows = drawContent({
      indicators,
      contentContainer,
      updateIndicator,
    });

    highlightCurrentIndicator({
      indicatorRows,
      indicator,
    });

    props.indicatorRows = indicatorRows;
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

    init.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  update() {
    const { highlightCurrentIndicator } = pureMethods;
    const {
      indicatorRows,
      indicator,
    } = privateProps.get(this);

    highlightCurrentIndicator({
      indicatorRows,
      indicator,
    });
  }
}

Object.assign(
  privateMethods,
  getPrivateBase({ privateProps, privateMethods }),
);

export default IndicatorDropdown;
