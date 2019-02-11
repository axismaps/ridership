
import atlasNationalFunctions from './atlasNationalFunctions';

import setInteractions from './atlasSetInteractions';

const atlasMethods = {
  drawMapSVG({
    mapContainer,
    width,
    height,
  }) {
    const mapSVG = mapContainer
      .append('svg')
      .styles({
        width: `${width}px`,
        height: `${height}px`,
      });

    return mapSVG;
  },
  getGeoProps({
    width,
    height,
    mobile,
    embedded,
  }) {
    const initialScale = d3.min([width, height]) * 1.25;
    const projection = d3.geoAlbersUsa()
      .translate([width / 2, height / 2]);

    const projectionModify = d3.geoAlbersUsa()
      .translate([width / 2, height / 2]);
    /**
     * instead of doing this we should just calculate scale based on viewport + USA bounds
     * @private
     */
    if (mobile || embedded) {
      [
        projection,
        projectionModify,
      ].forEach((prop) => {
        prop.scale(initialScale);
      });
    }
    const geoPath = d3.geoPath()
      .projection(projection);

    return {
      geoPath,
      projection,
      projectionModify,
    };
  },
  getInitialScaleTranslate({
    projection,
  }) {
    return {
      initialTranslate: projection.translate(),
      initialScale: projection.scale(),
    };
  },
  drawLayers({
    mapSVG,
  }) {
    const nationalView = mapSVG.append('g');
    const states = nationalView.append('g');
    const agencies = nationalView.append('g');

    const msaView = mapSVG.append('g');
    const tracts = msaView.append('g');
    const labels = msaView.append('g');

    return {
      nationalView,
      states,
      agencies,
      msaView,
      tracts,
      labels,
    };
  },
  getZoomed({
    mapFeatures,
    initialScale,
    initialTranslate,
    projectionModify,
    setCurrentTransform,
    onZoom,
  }) {
    const {
      zoomAgencies,
      zoomStates,
    } = atlasNationalFunctions;

    return () => {
      const { transform } = d3.event;

      setCurrentTransform(transform);

      const agencies = mapFeatures.get('agencies');
      const states = mapFeatures.get('states');

      /**
       * Re-project cluster nodes.
       * Everything else is scaled w/ un-modified original projection
       * @private
       */
      projectionModify
        .translate([(initialTranslate[0] * transform.k) + transform.x,
          (initialTranslate[1] * transform.k) + transform.y])
        .scale(initialScale * transform.k);

      onZoom(transform.k);

      zoomStates({
        states,
        transform,
      });

      zoomAgencies({
        agencies,
        projectionModify,
      });
    };
  },
  getZoom({
    zoomed,
    scaleExtent,
  }) {
    return d3.zoom()
      .scaleExtent(scaleExtent)
      .on('zoom', zoomed);
  },
  setZoomEvents({
    zoom,
    mapSVG,
  }) {
    mapSVG.call(zoom);
  },

  getAgenciesTable({
    nationalMapData,
    nationalDataView,
  }) {
    return nationalMapData
      .reduce((accumulator, msa) => {
        if (nationalDataView === 'ta') {
          msa.ta.forEach((ta) => {
            accumulator[ta.globalId] = ta;
          });
        } else {
          accumulator[msa.globalId] = msa;
        }

        return accumulator;
      }, {});
  },
  getUpdatedNodes({
    nodes,
    msaNodes,
    nationalMapData,
    nationalDataView,
  }) {
    const {
      getAgenciesTable,
    } = atlasMethods;

    const agenciesTable = getAgenciesTable({ nationalMapData, nationalDataView });
    const nodesToUse = nationalDataView === 'ta' ? nodes : msaNodes;
    return nodesToUse
      .map((node) => {
        const nodeCopy = Object.assign({}, node);
        const agency = agenciesTable[node.globalId];
        if (agency === undefined) return nodeCopy;
        nodeCopy.pctChange = agency.pctChange;
        nodeCopy.firstAndLast = agency.firstAndLast;
        return nodeCopy;
      });
  },
  setAgencyColors({
    agencies,
    changeColorScale,
    nationalMapData,
    nodes,
    msaNodes,
    nationalDataView,
  }) {
    const {
      getUpdatedNodes,
    } = atlasMethods;
    const updatedNodes = getUpdatedNodes({
      nodes,
      msaNodes,
      nationalMapData,
      nationalDataView,
    });

    agencies
      .data(updatedNodes, d => d.globalId)
      .transition()
      .duration(500)
      .attrs({
        fill: d => (d.pctChange === null ? 'lightgrey' : changeColorScale(d.pctChange)),
      });
  },
  setInteractions,
};

export default atlasMethods;
