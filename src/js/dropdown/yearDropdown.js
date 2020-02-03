import getPrivateBase from './dropdownBase';
import pureMethods from './yearDropdownMethods';
import getPublicDropdownBase from './dropdownPublicBase';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      years,
      yearRange,
      currentCensusField,
      contentContainer,
      toggleButton,
      toggleButtonText,
      updateYear,
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
      highlightCurrentYear,
    } = pureMethods;

    setMenuToggleEvents.call(this);
    setContentVisibility.call(this);

    setButtonText({
      years,
      toggleButtonText,
      defaultText,
    });

    setContentPosition.call(this);

    const yearRows = drawContent({
      yearRange,
      contentContainer,
      updateYear,
    });

    const mobileSelect = drawMobileContent({
      years,
      yearRange,
      toggleButton,
      updateYear,
    });

    highlightCurrentYear({
      yearRows,
      years,
      mobileSelect,
    });

    props.yearRows = yearRows;
    props.mobileSelect = mobileSelect;
  },
};

class YearDropdown {
  constructor(config) {
    const {
      init,
    } = privateMethods;
    privateProps.set(this, {
      alignMenuToButton: 'left',
    });
    this.config(config);

    init.call(this);

    this.updateCensusField();
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  updateCensusField() {
    const { currentCensusField, toggleButton } = privateProps.get(this);
    toggleButton.classed('atlas__year-button--range', false)
      .classed('atlas__year-button--nominal', false);
    if (!currentCensusField || currentCensusField.change) {
      toggleButton.classed('atlas__year-button--range', true);
    } else if (currentCensusField) {
      toggleButton.classed('atlas__year-button--nominal', true);
    }

    const {
      setContentPosition,
    } = privateMethods;

    setContentPosition.call(this);
  }

  update() {
    const {
      highlightCurrentYear,
      setButtonText,
    } = pureMethods;
    const {
      yearRows,
      years,
      toggleButtonText,
      defaultText,
      mobileSelect,
    } = privateProps.get(this);

    highlightCurrentYear({
      yearRows,
      years,
      mobileSelect,
    });

    setButtonText({
      defaultText,
      years,
      toggleButtonText,
    });
  }
}

Object.assign(
  privateMethods,
  getPrivateBase({ privateProps, privateMethods }),
);

Object.assign(
  YearDropdown.prototype,
  getPublicDropdownBase({ privateProps, privateMethods }),
);

export default YearDropdown;
