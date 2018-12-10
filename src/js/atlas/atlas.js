import atlasMethods from './atlasGeoFunctions';
import atlasNationalFunctions from './atlasNationalFunctions';
import DataProbe from '../dataProbe/dataProbe';
import atlasMSAFunctions from './atlasMsaFunctions';

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
      updateComparedAgencies,
    } = props;

    const {
      drawMapSVG,
      getGeoProps,
      drawLayers,
      // drawStates,
      getZoomed,
      setZoomEvents,
      getInitialScaleTranslate,
      setInteractions,
    } = atlasMethods;
    const {
      drawAgencies,
      drawStates,
    } = atlasNationalFunctions;

    const {
      setRadiusScale,
      toggleNationalLayers,
    } = privateMethods;

    setRadiusScale.call(this);

    const {
      radiusScale,
    } = props;

    const {
      geoPath,
      projection,
      projectionModify,
    } = getGeoProps({ width, height });

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


    const agencies = drawAgencies({
      jumpToMsa,
      radiusScale,
      dataProbe,
      layer: layers.agencies,
      nationalMapData,
      projection,
      changeColorScale,
      projectionModify,
      updateHighlightedAgencies,
      logSimulationNodes: (nodes) => {
        props.nodes = nodes;
      },
    });

    setInteractions({
      agencies,
      dataProbe,
      nationalDataView,
      comparedAgencies,
      compareMode,
      updateHighlightedAgencies,
      jumpToMsa,
    });

    mapFeatures.set('states', states);
    mapFeatures.set('agencies', agencies);

    const zoomed = getZoomed({
      // states,
      // agencies,
      // getAgencies: () => props.agencies,
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

    setZoomEvents({
      zoomed,
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
    });

    toggleNationalLayers.call(this);
  },
  setRadiusScale() {
    const props = privateProps.get(this);
    const { nationalMapData } = props;

    const { getRadiusScale } = atlasMethods;

    props.radiusScale = getRadiusScale({ nationalMapData });
  },
  drawMSA() {
    const {
      msa,
      tractTopo,
      layers,
      geoPath,
      mapFeatures,
    } = privateProps.get(this);
    const {
      drawTracts,
    } = atlasMSAFunctions;

    const tracts = drawTracts({
      tractTopo,
      msa,
      layers,
      geoPath,
    });

    mapFeatures.set('tracts', tracts);
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
      dataProbe: new DataProbe({
        container: d3.select('.outer-container'),
      }),
    });
    const {
      init,
    } = privateMethods;

    this.config(config);

    init.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  updateYears() {
    const props = privateProps.get(this);
    // const {
    //   setRadiusScale,
    // } = privateMethods;

    // setRadiusScale.call(this);

    const {
      nationalMapData,
      // radiusScale,
      agencies,
      nodes,
      changeColorScale,
      nationalDataView,
    } = props;
    const {
      // drawAgencies,
      // updateAgencyRadii,
      setAgencyColors,
    } = atlasMethods;

    // updateAgencyRadii({
    //   nationalMapData,
    //   radiusScale,
    //   agencies,
    //   nodes,
    //   changeColorScale,
    // });
    setAgencyColors({
      agencies,
      changeColorScale,
      nationalMapData,
      nodes,
      nationalDataView,
      // radiusScale,
    });

    return this;
  }

  updateNationalMapData() {
    const props = privateProps.get(this);
    const {
      nationalMapData,
      changeColorScale,
      agencies,
      nodes,
      nationalDataView,
      // radiusScale,
    } = props;
    const {
      // drawAgencies,
      setAgencyColors,
    } = atlasMethods;

    setAgencyColors({
      agencies,
      changeColorScale,
      nationalMapData,
      nodes,
      nationalDataView,
      // radiusScale,
    });

    return this;
  }

  updateNationalDataView() {
    const props = privateProps.get(this);
    const {
      nationalMapData,
      changeColorScale,
      dataProbe,
      jumpToMsa,
      updateHighlightedAgencies,
      mapFeatures,
      nationalDataView,
      radiusScale,
      layers,
      projection,
      projectionModify,
      comparedAgencies,
      compareMode,
    } = props;

    const {
      drawAgencies,
      drawMSAs,
    } = atlasNationalFunctions;

    if (nationalDataView === 'ta') {
      const agencies = drawAgencies({
        jumpToMsa,
        radiusScale,
        dataProbe,
        layer: layers.agencies,
        nationalMapData,
        projection,
        changeColorScale,
        projectionModify,
        updateHighlightedAgencies,
        logSimulationNodes: (nodes) => {
          props.nodes = nodes;
        },
      });

      mapFeatures.set('agencies', agencies);
      Object.assign(props, {
        agencies,
      });
    } else {
      const msas = drawMSAs({
        jumpToMsa,
        radiusScale,
        dataProbe,
        layer: layers.agencies,
        nationalMapData,
        projection,
        changeColorScale,
        projectionModify,
        updateHighlightedAgencies,
        logSimulationNodes: (nodes) => {
          props.nodes = nodes;
        },
      });
      mapFeatures.set('agencies', msas);
      Object.assign(props, {
        agencies: msas,
      });
    }

    return this;
  }

  updateInteractions() {
    const {
      agencies,
      dataProbe,
      nationalDataView,
      comparedAgencies,
      compareMode,
      updateHighlightedAgencies,
      jumpToMsa,
      updateComparedAgencies,
    } = privateProps.get(this);
    const {
      setInteractions,
    } = atlasMethods;
    setInteractions({
      agencies,
      dataProbe,
      nationalDataView,
      comparedAgencies,
      updateHighlightedAgencies,
      compareMode,
      jumpToMsa,
      updateComparedAgencies,
    });
  }

  updateCompare() {
    return this;
  }

  updateScale() {
    const props = privateProps.get(this);
    const {
      scale,
    } = props;
    const {
      drawMSA,
      toggleNationalLayers,
    } = privateMethods;

    if (scale === 'msa') {
      drawMSA.call(this);
      toggleNationalLayers.call(this);
    }
  }

  updateHighlight() {
    const {
      agencies,
      highlightedAgencies,
    } = privateProps.get(this);

    agencies.classed('highlight', (d) => {
      const highlightIds = highlightedAgencies.map(agency => agency.globalId);
      return highlightIds.includes(d.globalId);
    });
  }
}

export default Atlas;
