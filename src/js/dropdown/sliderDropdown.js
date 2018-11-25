import getPrivateBase from './dropdownBase';
import sliderPureMethods from './sliderDropdownMethods';

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
      contentOuterContainer,
    } = props;

    const {
      setMenuToggleEvents,
      setContentVisibility,
      setContentPosition,
    } = privateMethods;

    const {
      getSlider,
    } = sliderPureMethods;

    setContentPosition({
      toggleButton,
      contentOuterContainer,
    });

    setMenuToggleEvents.call(this);
    setContentVisibility.call(this);

    const slider = getSlider({
      yearRange,
      years,
      updateYears,
      contentContainer,
    });

    Object.assign(props, { slider });
  },
};

class SliderDropdown {
  constructor(config) {
    const {
      init,
    } = privateMethods;
    privateProps.set(this, {
      dropdownOpen: true,
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


    slider
      .config({
        currentValues: years,
      })
      .update();
  }
}

Object.assign(
  privateMethods,
  getPrivateBase({ privateProps, privateMethods }),
);

export default SliderDropdown;
