import msaAtlasFunctions from './msaAtlasFunctions';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);

    const {
      scale,
      msaMapContainer,
      msa,
      tractGeo,
      currentCensusField,
      distanceFilter,
    } = props;

    if (scale === 'national') return;

    const {
      drawAtlas,
    } = msaAtlasFunctions;

    const msaAtlas = drawAtlas({
      distanceFilter,
      msaMapContainer,
      msa,
      tractGeo,
      currentCensusField,
    });

    Object.assign(props, { msaAtlas, loaded: true });
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
      msaAtlas,
      loaded,
      tractGeo,
      currentCensusField,
      msa,
      distanceFilter,
    } = privateProps.get(this);
    const {
      init,
    } = privateMethods;

    if (!loaded) {
      init.call(this);
      return;
    }

    const {
      initSite,
    } = msaAtlasFunctions;

    initSite({
      distanceFilter,
      msa,
      msaAtlas,
      tractGeo,
      currentCensusField,
    });
  }

  updateData() {
    const {
      msaAtlas,
      loaded,
      tractGeo,
      currentCensusField,
      distanceFilter,
    } = privateProps.get(this);
    const {
      init,
    } = privateMethods;

    if (!loaded) {
      init.call(this);
      return;
    }

    const {
      drawTracts,
    } = msaAtlasFunctions;

    drawTracts({
      distanceFilter,
      msaAtlas,
      tractGeo,
      currentCensusField,
    });
  }
}

export default MSAAtlas;
