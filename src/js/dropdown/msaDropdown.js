import getDropdownBase from './dropdownBase';
import msaDropdownFunctions from './msaDropdownFunctions';
import getPublicDropdownBase from './dropdownPublicBase';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const {
      drawContent,
      drawMobileContent,
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
      mobileSelect,
    } = props;

    setMenuToggleEvents.call(this);
    setContentVisibility.call(this);
    setContentPosition.call(this);


    const msaRows = drawContent({
      contentContainer,
      msaList,
      updateMSA,
    });

    drawMobileContent({
      msaList,
      mobileSelect,
      updateMSA,
    });

    Object.assign(props, { msaRows });

    this.update();
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
      mobileSelect,
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
      mobileSelect,
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
