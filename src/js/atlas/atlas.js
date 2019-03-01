import atlasGeoFunctions from './atlasGeoFunctions';
import atlasNationalFunctions from './atlasNationalFunctions';
import DataProbe from '../dataProbe/dataProbe';
import getPublicFunctions from './atlasPublicFunctions';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);

    const {
      mapContainer,
      width,
      height,
      statesTopo,
      nationalMapData,
      changeColorScale,
      dataProbe,
      jumpToMsa,
      updateHighlightedAgencies,
      mapFeatures,
      nationalDataView,
      comparedAgencies,
      compareMode,
      years,
      allNationalMapData,
      indicator,
      scaleExtent,
      onZoom,
      mobile,
      embedded,
    } = props;

    const {
      drawMapSVG,
      getGeoProps,
      drawLayers,
      getZoom,
      getZoomed,
      setZoomEvents,
      getInitialScaleTranslate,
      setInteractions,
    } = atlasGeoFunctions;
    const {
      zoomAgencies,
      setMSANodes,
      drawMSAs,
      setAgencyNodes,
      drawAgencies,
      drawStates,
    } = atlasNationalFunctions;

    const {
      toggleNationalLayers,
    } = privateMethods;


    const {
      radiusScale,
    } = props;

    const {
      geoPath,
      projection,
      projectionModify,
    } = getGeoProps({
      width,
      height,
      mobile,
      embedded,
    });

    const {
      initialTranslate,
      initialScale,
    } = getInitialScaleTranslate({ projection });

    const mapSVG = drawMapSVG({
      mapContainer,
      width,
      height,
    });

    const layers = drawLayers({
      mapSVG,
    });

    const states = drawStates({
      layer: layers.states,
      statesTopo,
      geoPath,
    });

    setAgencyNodes({
      nationalMapData,
      radiusScale,
      projectionModify,
      logSimulationNodes: (newNodes) => {
        props.nodes = newNodes;
      },
    });


    setMSANodes({
      nationalMapData,
      radiusScale,
      projectionModify,
      logSimulationNodes: (newNodes) => {
        props.msaNodes = newNodes;
      },
    });

    const { nodes, msaNodes } = props;
    let agencies;
    if (nationalDataView === 'ta') {
      agencies = drawAgencies({
        jumpToMsa,
        radiusScale,
        dataProbe,
        layer: layers.agencies,
        nationalMapData,
        projection,
        changeColorScale,
        projectionModify,
        updateHighlightedAgencies,
        nodes,
      });
    } else {
      agencies = drawMSAs({
        jumpToMsa,
        radiusScale,
        dataProbe,
        layer: layers.agencies,
        nationalMapData,
        projection,
        changeColorScale,
        projectionModify,
        updateHighlightedAgencies,
        msaNodes,
        logSimulationNodes: (newNodes) => {
          props.msaNodes = newNodes;
        },
      });
    }

    zoomAgencies({
      agencies,
      projectionModify,
    });

    setInteractions({
      agencies,
      dataProbe,
      nationalDataView,
      comparedAgencies,
      compareMode,
      updateHighlightedAgencies,
      jumpToMsa,
      mapContainer,
      years,
      allNationalMapData,
      indicator,
      mobile,
      embedded,
    });

    mapFeatures.set('states', states);
    mapFeatures.set('agencies', agencies);

    const zoomed = getZoomed({
      onZoom,
      getScale: () => props.scale,
      mapFeatures,
      initialScale,
      initialTranslate,
      projectionModify,
      geoPath,
      setCurrentTransform: (newTransform) => {
        props.transform = newTransform;
      },
    });

    const zoom = getZoom({
      zoomed,
      scaleExtent,
    });

    setZoomEvents({
      zoom,
      mapSVG,
    });


    Object.assign(props, {
      states,
      agencies,
      layers,
      mapSVG,
      projection,
      projectionModify,
      geoPath,
      radiusScale,
      zoom,
    });

    toggleNationalLayers.call(this);
    this.updateCompared();
  },

  setDimensions() {
    const props = privateProps.get(this);
    const {
      mapContainer,
    } = props;
    const {
      width,
      height,
    } = mapContainer.node()
      .getBoundingClientRect();

    Object.assign(props, { width, height });
  },

  toggleNationalLayers() {
    const {
      layers,
      scale,
    } = privateProps.get(this);
    const {
      nationalView,
      msaView,
    } = layers;
    nationalView
      .classed('map__hidden-layer', scale === 'msa');

    msaView
      .classed('map__hidden-layer', scale === 'national');
  },
};

class Atlas {
  constructor(config) {
    const { mapContainer } = config;
    const {
      width,
      height,
    } = mapContainer.node().getBoundingClientRect();
    privateProps.set(this, {
      // mapContainer,
      width,
      height,
      statesTopo: null,
      layers: null,
      nationalMapData: null,
      mapFeatures: new Map(),
      searchResult: null,
      dataProbe: new DataProbe({
        container: d3.select('.outer-container'),
      }),
      transform: {
        k: 1,
        x: 0,
        y: 0,
      },
    });
    const {
      init,
    } = privateMethods;

    this.config(config);

    init.call(this);

    this.setZoom();
  }
}

Object.assign(
  Atlas.prototype,
  getPublicFunctions({ privateProps, privateMethods }),
);

export default Atlas;
