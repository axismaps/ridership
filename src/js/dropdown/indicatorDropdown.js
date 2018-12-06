import getPrivateBase from './dropdownBase';
import pureMethods from './indicatorDropdownMethods';
import getPublicDropdownBase from './dropdownPublicBase';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      indicators,
      contentContainer,
      indicator,
      toggleButtonText,
      updateIndicator,
    } = props;

    const {
      setMenuToggleEvents,
      setContentVisibility,
      setContentPosition,
    } = privateMethods;

    const {
      drawContent,
      setButtonText,
      highlightCurrentIndicator,
    } = pureMethods;

    setMenuToggleEvents.call(this);
    setContentVisibility.call(this);

    setButtonText({
      indicator,
      toggleButtonText,
    });

    setContentPosition.call(this);

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

    });
    this.config(config);

    init.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  update() {
    const {
      highlightCurrentIndicator,
      setButtonText,
    } = pureMethods;
    const {
      indicatorRows,
      indicator,
      toggleButtonText,
    } = privateProps.get(this);

    highlightCurrentIndicator({
      indicatorRows,
      indicator,
    });

    setButtonText({
      indicator,
      toggleButtonText,
    });
  }
}

Object.assign(
  privateMethods,
  getPrivateBase({ privateProps, privateMethods }),
);

Object.assign(
  IndicatorDropdown.prototype,
  getPublicDropdownBase({ privateProps, privateMethods }),
);

export default IndicatorDropdown;
