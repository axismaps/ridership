import pureMethods from './dataviewDropdownMethods';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      contentContainer,
      updateNationalDataView,
      nationalDataView,
    } = props;

    const {
      drawButtons,
    } = pureMethods;

    const buttons = drawButtons({
      contentContainer,
      nationalDataView,
      updateNationalDataView,
    });

    props.buttons = buttons;
  },
};

class DataViewDropdown {
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
      contentContainer,
      nationalDataView,
    } = privateProps.get(this);

    contentContainer.selectAll('.header__data-view-button')
      .classed('header__data-view-button--highlighted', d => nationalDataView === d.value);
  }
}

export default DataViewDropdown;
