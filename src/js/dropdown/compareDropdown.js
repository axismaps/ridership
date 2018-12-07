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
      toggleButtonText,
      nationalMapData,
      comparedAgencies,
    } = props;

    const {
      setMenuToggleEvents,
      setContentVisibility,
      setContentPosition,
    } = privateMethods;

    const {
      drawContent,
      setButtonText,
      highlightCurrent,
    } = pureMethods;

    const compareRows = drawContent({
      nationalMapData,
      updateComparedAgencies,
      contentContainer,
    });

    highlightCurrent({
      compareRows,
      comparedAgencies,
    });

    props.compareRows = compareRows;

    setMenuToggleEvents.call(this);
    setContentVisibility.call(this);

    setButtonText({
      toggleButtonText,
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
      setButtonText,
    } = pureMethods;
    const {
      comparedAgencies,
      compareRows,
      toggleButtonText,
    } = privateProps.get(this);

    highlightCurrent({
      compareRows,
      comparedAgencies,
    });


    setButtonText({
      toggleButtonText,
    });
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
