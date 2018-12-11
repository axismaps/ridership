import getPrivateBase from './dropdownBase';
import pureMethods from './compareDropdownMethods';
import getPublicDropdownBase from './dropdownPublicBase';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      contentContainer,
      updateComparedAgencies,
      nationalMapData,
      comparedAgencies,
      toggleButton,
      updateNationalDataView,
      updateCompareMode,
    } = props;

    const {
      setMenuToggleEvents,
      setContentVisibility,
      setContentPosition,
    } = privateMethods;

    const {
      drawContent,
      highlightCurrent,
    } = pureMethods;

    const compareRows = drawContent({
      nationalMapData,
      updateComparedAgencies,
      contentContainer,
      updateNationalDataView,
      updateCompareMode,
    });

    highlightCurrent({
      compareRows,
      comparedAgencies,
    });

    props.compareRows = compareRows;

    setMenuToggleEvents.call(this);
    setContentVisibility.call(this);

    toggleButton.select('.fa-times-circle').on('click', () => {
      updateComparedAgencies([]);
      updateCompareMode(false);
    });

    setContentPosition.call(this);
  },
};

class CompareDropdown {
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
      highlightCurrent,
    } = pureMethods;
    const {
      comparedAgencies,
      compareRows,
      compareMode,
    } = privateProps.get(this);

    const {
      setMenuToggleEvents,
      removeMenuToggleEvents,
    } = privateMethods;

    highlightCurrent({
      compareRows,
      comparedAgencies,
    });

    if (compareMode === true) {
      removeMenuToggleEvents.call(this);
    } else {
      setMenuToggleEvents.call(this);
    }
  }
}

Object.assign(
  privateMethods,
  getPrivateBase({ privateProps, privateMethods }),
);

Object.assign(
  CompareDropdown.prototype,
  getPublicDropdownBase({ privateProps, privateMethods }),
);

export default CompareDropdown;
