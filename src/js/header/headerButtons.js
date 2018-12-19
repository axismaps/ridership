import headerButtonMethods from './headerButtonMethods';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      exportButton,
      exportComponents,
      exportMethods,
    } = props;

    const {
      assembleExport,
    } = headerButtonMethods;

    exportButton.on('click', () => {
      exportComponents(assembleExport);
    });
  },
};

class HeaderButtons {
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
}

export default HeaderButtons;
