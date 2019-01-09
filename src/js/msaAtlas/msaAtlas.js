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
      // taLayers,
      currentCensusField,
      scaleExtent,
      onZoom,
      setMinScale,
    } = props;

    if (scale === 'national') return;

    const {
      drawAtlas,
    } = msaAtlasFunctions;

    const msaAtlas = drawAtlas({
      onZoom,
      msaMapContainer,
      msa,
      tractGeo,
      scaleExtent,
      currentCensusField,
      saveCamera: (camera) => {
        props.camera = camera;
      },
      setMinScale,
      getCurrentCamera: () => props.camera,
      logInitialFilters: (style) => {
        const taLayers = style.layers
          .filter(d => d.id.includes('transit'))
          .map(d => d.id);
        const initialFilters = taLayers
          .reduce((accumulator, layerId) => {
            accumulator[layerId] = msaAtlas.getFilter(layerId);
            return accumulator;
          }, {});
        console.log('initialFilters??', initialFilters);
        props.initialFilters = initialFilters;
        props.taLayers = taLayers;
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
      taLayers: null,
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
    const props = privateProps.get(this);
    const {
      msaAtlas,
      loaded,
      tractGeo,
      currentCensusField,
      msa,
      setMinScale,
    } = props;
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
      setMinScale,
      saveCamera: (camera) => {
        props.camera = camera;
      },
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

  zoomIn() {
    const {
      msaAtlas,
    } = privateProps.get(this);
    msaAtlas.zoomIn();
  }

  zoomOut() {
    const {
      msaAtlas,
    } = privateProps.get(this);
    msaAtlas.zoomOut();
  }

  zoomBounds() {
    const {
      camera,
      msaAtlas,
    } = privateProps.get(this);
    msaAtlas.easeTo(Object.assign({}, camera, { duration: 750 }));
  }

  updateExtents() {
    const {
      msaAtlas,
      scaleExtent,
    } = privateProps.get(this);
    msaAtlas.setMinZoom(scaleExtent[0]);
    msaAtlas.setMaxZoom(scaleExtent[1]);
  }

  export() {
    const {
      msaAtlas,
      currentCensusField,
      msa,
      years,
    } = privateProps.get(this);

    return Promise.resolve(msaAtlas.getCanvas())
      .then((canvas) => {
        const headerHeight = 40;
        const fullCavnas = document.createElement('canvas');
        fullCavnas.width = canvas.width;
        fullCavnas.height = canvas.height + headerHeight;
        const ctx = fullCavnas.getContext('2d');
        ctx.fillStyle = '#2D74ED';
        ctx.font = '18px Mark, Arial, sans-serif';
        ctx.textBaseline = 'middle';
        console.log(currentCensusField, msa);
        ctx.fillText(`${currentCensusField.text} (% change, ${years.join('–')}), ${msa.name}`, 10, headerHeight / 2, canvas.width - 20);
        ctx.drawImage(canvas, 0, headerHeight);
        return Promise.resolve(fullCavnas);
      });
  }
}

export default MSAAtlas;
