import getDropdownBase from './dropdownBase';
import msaDropdownFunctions from './msaDropdownFunctions';
import getPublicDropdownBase from './dropdownPublicBase';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const {
      drawContent,
    } = msaDropdownFunctions;
    const {
      setMenuToggleEvents,
      setContentVisibility,
      setContentPosition,
    } = privateMethods;
    const props = privateProps.get(this);
    const {
      contentContainer,
      msaList,
      updateMSA,
    } = props;

    setMenuToggleEvents.call(this);
    setContentVisibility.call(this);
    setContentPosition.call(this);

    const msaRows = drawContent({
      contentContainer,
      msaList,
      updateMSA,
    });

    Object.assign(props, { msaRows });
  },
};

class MSADropdown {
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
      msaRows,
      currentMSA,
      toggleButton,
    } = privateProps.get(this);
    const {
      setButtonText,
      highlightCurrentMSA,
    } = msaDropdownFunctions;

    setButtonText({
      toggleButton,
      currentMSA,
    });

    highlightCurrentMSA({
      msaRows,
      currentMSA,
    });
  }
}

Object.assign(
  privateMethods,
  getDropdownBase({ privateProps, privateMethods }),
);

Object.assign(
  MSADropdown.prototype,
  getPublicDropdownBase({ privateProps, privateMethods }),
);

export default MSADropdown;
