import atlasGeoFunctions from './atlasGeoFunctions';
import atlasNationalFunctions from './atlasNationalFunctions';

const getPublicFunctions = ({ privateProps, privateMethods }) => ({

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  },

  updateYears() {
    const props = privateProps.get(this);
    // const {
    //   setRadiusScale,
    // } = privateMethods;

    // setRadiusScale.call(this);

    const {
      nationalMapData,
      agencies,
      nodes,
      msaNodes,
      changeColorScale,
      nationalDataView,
    } = props;
    const {
      setAgencyColors,
    } = atlasGeoFunctions;


    setAgencyColors({
      agencies,
      changeColorScale,
      nationalMapData,
      nodes,
      msaNodes,
      nationalDataView,
    });

    return this;
  },

  updateNationalMapData() {
    const props = privateProps.get(this);
    const {
      nationalMapData,
      changeColorScale,
      agencies,
      nodes,
      msaNodes,
      nationalDataView,
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
      msaNodes,
      nationalDataView,
    });

    return this;
  },

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
      // comparedAgencies,
      // compareMode,
      nodes,
      msaNodes,
    } = props;

    const {
      drawAgencies,
      drawMSAs,
      zoomAgencies,
    } = atlasNationalFunctions;
    const {
      getUpdatedNodes,
    } = atlasGeoFunctions;

    const updatedNodes = getUpdatedNodes({
      nodes,
      msaNodes,
      nationalMapData,
      nationalDataView,
    });
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
        nodes: updatedNodes,
        logSimulationNodes: (newNodes) => {
          props.nodes = newNodes;
        },
      });

      zoomAgencies({
        agencies,
        projectionModify,
      });
      mapFeatures.set('agencies', agencies);
      Object.assign(props, {
        agencies,
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
        msaNodes: updatedNodes,
        logSimulationNodes: (newNodes) => {
          props.msaNodes = newNodes;
        },
      });
      mapFeatures.set('agencies', agencies);
      zoomAgencies({
        agencies,
        projectionModify,
      });
      Object.assign(props, {
        agencies,
      });
    }

    return this;
  },

  updateCompared() {
    const {
      agencies,
      comparedAgencies,
    } = privateProps.get(this);

    const ids = comparedAgencies.map(d => d.globalId);

    agencies.classed('compared', d => ids.includes(d.globalId));

    return this;
  },

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
      mobile,
      embedded,
    } = privateProps.get(this);
    const {
      setInteractions,
    } = atlasGeoFunctions;
    setInteractions({
      embedded,
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
      mobile,
    });
  },

  updateCompare() {
    return this;
  },

  updateHighlight() {
    const {
      agencies,
      highlightedAgencies,
    } = privateProps.get(this);

    const highlightIds = highlightedAgencies.map(agency => agency.globalId);

    agencies.classed('highlight', d => highlightIds.includes(d.globalId))
      .classed('map__agency-dim', (d) => {
        if (highlightIds.length === 0) return false;
        const othersInMSA = agencies.filter(a => a.msaId === d.msaId).data();
        return othersInMSA.some(a => highlightIds.includes(a.globalId)) === false;
      });
  },

  updateSearchResult() {
    const {
      agencies,
      searchResult,
    } = privateProps.get(this);

    agencies.classed('search-result', d => searchResult !== null && d.globalId === searchResult.globalId);
  },

  zoomIn() {
    const {
      zoom,
      mapSVG,
    } = privateProps.get(this);

    mapSVG.transition()
      .duration(500)
      .call(zoom.scaleBy, 2);
  },

  zoomOut() {
    const {
      zoom,
      mapSVG,
    } = privateProps.get(this);

    mapSVG.transition()
      .duration(500)
      .call(zoom.scaleBy, 0.5);
  },

  zoomBounds() {
    const {
      zoom,
      mapSVG,
    } = privateProps.get(this);

    mapSVG.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity);
  },

  setZoom() {
    const {
      onZoom,
      transform,
    } = privateProps.get(this);
    onZoom(transform.k);
  },

  updateSize() {
    const {
      setDimensions,
    } = privateMethods;

    setDimensions.call(this);

    const {
      mapSVG,
      width,
      height,
    } = privateProps.get(this);

    mapSVG.styles({
      width: `${width}px`,
      height: `${height}px`,
    });
  },

  export() {
    const {
      exportMethods,
      mapSVG,
      // scale,
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
        fullCavnas.width = canvas.width + 40;
        fullCavnas.height = canvas.height + headerHeight;
        const ctx = fullCavnas.getContext('2d');
        ctx.fillStyle = '#000';
        ctx.font = 'bold 18px Mark, Arial, sans-serif';
        ctx.textBaseline = 'middle';
        const dataViewDisplay = nationalDataView === 'ta' ? 'transit agency' : 'MSA';
        ctx.fillText(`${indicator.text} (% change, ${years.join('–')}) `, 20, headerHeight / 2);
        ctx.drawImage(canvas, 20, headerHeight);
        const x = ctx.measureText(`${indicator.text} (% change, ${years.join('–')}) `).width + 20;
        ctx.font = '18px Mark, Arial, sans-serif';
        ctx.fillText(`by ${dataViewDisplay}`, x, headerHeight / 2);
        return Promise.resolve(fullCavnas);
      });
  },
});

export default getPublicFunctions;
