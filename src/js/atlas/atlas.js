import atlasGeoFunctions from './atlasGeoFunctions';
import atlasNationalFunctions from './atlasNationalFunctions';
import DataProbe from '../dataProbe/dataProbe';

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
      // updateComparedAgencies,
      years,
      allNationalMapData,
      indicator,
      scaleExtent,
    } = props;

    const {
      drawMapSVG,
      getGeoProps,
      drawLayers,
      // drawStates,
      getZoom,
      getZoomed,
      setZoomEvents,
      getInitialScaleTranslate,
      setInteractions,
    } = atlasGeoFunctions;
    const {
      drawAgencies,
      drawStates,
    } = atlasNationalFunctions;

    const {
      // setRadiusScale,
      toggleNationalLayers,
    } = privateMethods;

    // setRadiusScale.call(this);

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
      mapContainer,
      years,
      allNationalMapData,
      indicator,
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
  },
  // setRadiusScale() {
  //   const props = privateProps.get(this);
  //   const { nationalMapData } = props;

  //   const { getRadiusScale } = atlasGeoFunctions;

  //   props.radiusScale = getRadiusScale({ nationalMapData });
  // },

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
    } = atlasGeoFunctions;

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
    } = atlasGeoFunctions;

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

  updateCompared() {
    const {
      agencies,
      comparedAgencies,
    } = privateProps.get(this);

    const ids = comparedAgencies.map(d => d.globalId);

    agencies.classed('compared', d => ids.includes(d.globalId));

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
      mapContainer,
      years,
      allNationalMapData,
      indicator,
    } = privateProps.get(this);
    const {
      setInteractions,
    } = atlasGeoFunctions;
    setInteractions({
      agencies,
      dataProbe,
      nationalDataView,
      comparedAgencies,
      updateHighlightedAgencies,
      compareMode,
      jumpToMsa,
      updateComparedAgencies,
      mapContainer,
      years,
      allNationalMapData,
      indicator,
    });
  }

  updateCompare() {
    return this;
  }

  // updateScale() {
  //   const props = privateProps.get(this);
  //   const {
  //     scale,
  //   } = props;
  //   const {
  //     drawMSA,
  //     toggleNationalLayers,
  //   } = privateMethods;

  //   if (scale === 'msa') {
  //     drawMSA.call(this);
  //     toggleNationalLayers.call(this);
  //   }
  // }

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

  updateSearchResult() {
    const {
      agencies,
      searchResult,
    } = privateProps.get(this);

    agencies.classed('search-result', d => searchResult !== null && d.globalId === searchResult.globalId);
  }

  zoomIn() {
    const {
      // onZoom,
      zoom,
      mapSVG,
    } = privateProps.get(this);

    mapSVG.transition()
      .duration(500)
      .call(zoom.scaleBy, 2);
  }

  zoomOut() {
    const {
      // onZoom,
      zoom,
      mapSVG,
    } = privateProps.get(this);

    mapSVG.transition()
      .duration(500)
      .call(zoom.scaleBy, 0.5);
  }

  export() {
    const {
      exportMethods,
      mapSVG,
      scale,
      years,
      indicator,
      nationalDataView,
    } = privateProps.get(this);


    const svgNode = mapSVG.node();
    const { SVGtoCanvas } = exportMethods;

    return SVGtoCanvas({ svgNode })
      .then((canvas) => {
        const headerHeight = 40;
        const fullCavnas = document.createElement('canvas');
        fullCavnas.width = canvas.width;
        fullCavnas.height = canvas.height + headerHeight;
        const ctx = fullCavnas.getContext('2d');
        ctx.fillStyle = '#2D74ED';
        ctx.font = '18px Mark, Arial, sans-serif';
        ctx.textBaseline = 'middle';
        const dataViewDisplay = nationalDataView === 'ta' ? 'transit agency' : 'MSA';
        ctx.fillText(`${indicator.text} (% change, ${years.join('–')}) by ${dataViewDisplay}`, 10, headerHeight / 2, canvas.width - 20);
        ctx.drawImage(canvas, 0, headerHeight);
        return Promise.resolve(fullCavnas);
      });
  }
}

export default Atlas;
