import msaAtlasFunctions from './msaAtlasFunctions';
import DataProbe from '../dataProbe/dataProbe';

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
      dataProbe,
      setMinScale,
      updateStateHighlightedTracts,
    } = props;

    if (scale === 'national') return;

    const {
      drawAtlas,
    } = msaAtlasFunctions;

    const msaAtlas = drawAtlas({
      updateStateHighlightedTracts,
      dataProbe,
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
      getCurrentCensusField: () => props.currentCensusField,
      setHoverStatus: (status) => {
        props.tractHovering = status;
      },
      getYears: () => props.years,
      logInitialFilters: (style) => {
        const taLayers = style.layers
          .filter(d => d.id.includes('transit'))
          .map(d => d.id);
        const initialFilters = taLayers
          .reduce((accumulator, layerId) => {
            accumulator[layerId] = msaAtlas.getFilter(layerId);
            return accumulator;
          }, {});
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
      dataProbe: new DataProbe({
        container: d3.select('.outer-container'),
      }),
      tractHovering: false,
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

  updateHighlightedTracts() {
    const {
      highlightedTracts,
      tractHovering,
      msaAtlas,
    } = privateProps.get(this);

    if (tractHovering) return;

    const highlightedGeoIds = highlightedTracts.map(d => d.id);
    const features = msaAtlas.queryRenderedFeatures({
      layers: ['tract-fill'],
    });

    features.forEach((feature) => {
      if (highlightedGeoIds.includes(feature.properties.id)) {
        msaAtlas.setFeatureState({
          source: 'tracts',
          id: feature.id,
        },
        { hover: true });
      } else {
        msaAtlas.setFeatureState({
          source: 'tracts',
          id: feature.id,
        },
        { hover: false });
      }
    });
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
        fullCavnas.width = canvas.width + 40;
        fullCavnas.height = canvas.height + headerHeight;
        const ctx = fullCavnas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.font = 'bold 18px Mark, Arial, sans-serif';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${currentCensusField.text} (% change, ${years.join('–')}), `, 20, headerHeight / 2);
        const x = ctx.measureText(`${currentCensusField.text} (% change, ${years.join('–')}), `).width + 20;
        ctx.font = '18px Mark, Arial, sans-serif';
        ctx.fillText(msa.name, x, headerHeight / 2);
        ctx.drawImage(canvas, 20, headerHeight);
        return Promise.resolve(fullCavnas);
      });
  }
}

export default MSAAtlas;
