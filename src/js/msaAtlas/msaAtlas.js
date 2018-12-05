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

    if (scale === 'national') return;

    const {
      drawAtlas,
    } = msaAtlasFunctions;

    const msaAtlas = drawAtlas({
      msaMapContainer,
      msa,
    });

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
    const {
      init,
    } = privateMethods;
    if (!loaded) {
      init.call(this);
      return;
    }

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
