import msaAtlasFunctions from './msaAtlasFunctions';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);

    const {
      scale,
      msaMapContainer,
      msa,
    } = props;

    console.log('init msa');
    if (scale === 'national') return;

    const {
      drawAtlas,
    } = msaAtlasFunctions;

    const msaAtlas = drawAtlas({
      msaMapContainer,
      msa,
    });

    console.log('atlas?', msaAtlas);
    Object.assign(props, { msaAtlas, loaded: true });
    // props.loaded = true;
  },
};

class MSAAtlas {
  constructor(config) {
    const {
      init,
    } = privateMethods;

    privateProps.set(this, {
      loaded: false,
    });

    this.config(config);

    init.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  updateScale() {
    const {
      loaded,
      scale,
    } = privateProps.get(this);
    const {
      init,
    } = privateMethods;
    if (scale === 'msa' && !loaded) {
      init.call(this);
    }
  }

  updateMSA() {
    const {
      msa,
      msaAtlas,
      loaded,
    } = privateProps.get(this);
    if (!loaded) return;

    const {
      jumpToMSA,
    } = msaAtlasFunctions;

    jumpToMSA({
      msaAtlas,
      msa,
    });
  }
}

export default MSAAtlas;
