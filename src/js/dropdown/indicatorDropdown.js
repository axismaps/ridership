import getPrivateBase from './dropdownBase';
import pureMethods from './indicatorDropdownMethods';
import getPublicDropdownBase from './dropdownPublicBase';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      indicators,
      censusFields,
      contentContainer,
      indicator,
      toggleButton,
      toggleButtonText,
      updateIndicator,
      defaultText,
    } = props;

    const {
      setMenuToggleEvents,
      setContentVisibility,
      setContentPosition,
    } = privateMethods;

    const {
      drawContent,
      drawMobileContent,
      setButtonText,
      highlightCurrentIndicator,
    } = pureMethods;

    setMenuToggleEvents.call(this);
    setContentVisibility.call(this);

    setButtonText({
      indicator,
      toggleButtonText,
      defaultText,
    });

    setContentPosition.call(this);

    const indicatorRows = drawContent({
      indicators,
      contentContainer,
      updateIndicator,
      censusFields,
    });

    const mobileSelect = drawMobileContent({
      indicator,
      indicators,
      toggleButton,
      updateIndicator,
    });

    highlightCurrentIndicator({
      indicatorRows,
      mobileSelect,
      indicator,
      censusFields,
    });

    props.indicatorRows = indicatorRows;
    props.mobileSelect = mobileSelect;
  },
};

class IndicatorDropdown {
  constructor(config) {
    const {
      init,
    } = privateMethods;
    privateProps.set(this, {
      alignMenuToButton: 'left',
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
      defaultText,
      mobileSelect,
      censusFields,
    } = privateProps.get(this);

    highlightCurrentIndicator({
      indicatorRows,
      indicator,
      mobileSelect,
      censusFields,
    });

    setButtonText({
      defaultText,
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
