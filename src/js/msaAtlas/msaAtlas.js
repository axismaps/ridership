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
      taLayers,
      currentCensusField,
    } = props;

    if (scale === 'national') return;

    const {
      drawAtlas,
    } = msaAtlasFunctions;

    const msaAtlas = drawAtlas({
      msaMapContainer,
      msa,
      tractGeo,
      currentCensusField,
      logInitialFilters: () => {
        const initialFilters = taLayers.reduce((accumulator, layerId) => {
          accumulator[layerId] = msaAtlas.getFilter(layerId);
          return accumulator;
        }, {});
        props.initialFilters = initialFilters;
      },
      updateAgencyLayers: () => {
        this.updateAgencyLayers();
      },
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
      taLayers: [
        'rail case',
        'rail top',
        'ferry',
        'bus high freq',
        'bus',
      ],
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
    return this;
  }

  updateMSA() {
    const {
      msaAtlas,
      loaded,
      tractGeo,
      currentCensusField,
      msa,
    } = privateProps.get(this);
    const {
      init,
    } = privateMethods;

    if (!loaded) {
      init.call(this);
      return this;
    }

    const {
      initSite,
    } = msaAtlasFunctions;

    initSite({
      msa,
      msaAtlas,
      tractGeo,
      currentCensusField,
    });

    this.updateAgencyLayers();

    return this;
  }

  updateData() {
    const {
      msaAtlas,
      loaded,
      tractGeo,
      currentCensusField,
    } = privateProps.get(this);
    const {
      init,
    } = privateMethods;

    if (!loaded) {
      init.call(this);
      return this;
    }

    const {
      drawTracts,
    } = msaAtlasFunctions;

    drawTracts({
      msaAtlas,
      tractGeo,
      currentCensusField,
    });
    return this;
  }

  updateAgencyLayers() {
    const {
      msaAtlas,
      initialFilters,
      currentAgencies,
      taLayers,
      taFilter,
    } = privateProps.get(this);

    const agenciesToShow = currentAgencies
      .map(d => d.taId)
      .filter(d => !taFilter.has(d))
      .map(d => Number(d));

    taLayers.forEach((layerId) => {
      const filterCopy = [
        ...initialFilters[layerId],
        ['in', 'taid', ...agenciesToShow],
      ];
      msaAtlas.setFilter(layerId, filterCopy);
    });
  }
}

export default MSAAtlas;
