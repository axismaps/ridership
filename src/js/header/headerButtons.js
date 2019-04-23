import headerButtonMethods from './headerButtonMethods';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      exportButton,
      exportComponents,
      aboutButton,
      howtoButton,
      // exportMethods,
    } = props;

    const {
      assembleExport,
    } = headerButtonMethods;

    exportButton.on('click', () => {
      exportComponents(assembleExport);
    });

    aboutButton.on('click', () => {
      d3.select('.about-lightbox').classed('show', true);
    });

    howtoButton.on('click', () => {
      d3.select('.story-lightbox').classed('show', true);
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
