import getPrivateBase from './dropdownBase';
import sliderPureMethods from './sliderDropdownMethods';
import getPublicDropdownBase from './dropdownPublicBase';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);

    const {
      yearRange,
      years,
      updateYears,
      contentContainer,
      toggleButton,
    } = props;

    const {
      setMenuToggleEvents,
      setToggleButtonText,
      setContentVisibility,
      setContentPosition,
    } = privateMethods;

    const {
      getSlider,
      getMobileModal,
    } = sliderPureMethods;

    setContentPosition.call(this);

    setMenuToggleEvents.call(this);
    setToggleButtonText.call(this);
    setContentVisibility.call(this);

    const slider = getSlider({
      yearRange,
      years,
      updateYears,
      contentContainer,
    });

    const modal = getMobileModal({
      toggleButton,
      yearRange,
      years,
      updateYears,
    });

    Object.assign(props, { slider, modal });
  },
  setToggleButtonText() {
    const {
      toggleButtonText,
      years,
    } = privateProps.get(this);
    toggleButtonText
      .text(`${years[0]} - ${years[1]}`);
  },
};

class SliderDropdown {
  constructor(config) {
    const {
      init,
    } = privateMethods;
    privateProps.set(this, {
      dropdownOpen: false,
    });

    this.config(config);

    init.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  updateYears() {
    const {
      years,
      slider,
    } = privateProps.get(this);

    const {
      setToggleButtonText,
    } = privateMethods;

    slider
      .config({
        currentValues: years,
      })
      .update();

    setToggleButtonText.call(this);
  }

  updateYearRange() {
    const {
      yearRange,
      slider,
    } = privateProps.get(this);
    slider
      .config({
        valueRange: yearRange,
      })
      .updateValueRange()
      .update();
    return this;
  }
}

Object.assign(
  privateMethods,
  getPrivateBase({ privateProps, privateMethods }),
);

Object.assign(
  SliderDropdown.prototype,
  getPublicDropdownBase({ privateProps, privateMethods }),
);

export default SliderDropdown;
