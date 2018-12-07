import atlasHelperFunctions from './atlasHelperFunctions';
import atlasNationalFunctions from './atlasNationalFunctions';
import atlasMSAFunctions from './atlasMsaFunctions';

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
  }) {
    const projection = d3.geoAlbersUsa()
      .translate([width / 2, height / 2]);

    const projectionModify = d3.geoAlbersUsa()
      .translate([width / 2, height / 2]);

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
    getScale,
  }) {
    const {
      zoomAgencies,
      zoomStates,
    } = atlasNationalFunctions;
    const {
      zoomTracts,
    } = atlasMSAFunctions;
    return () => {
      const { transform } = d3.event;
      setCurrentTransform(transform);

      const scale = getScale();

      const agencies = mapFeatures.get('agencies');
      const states = mapFeatures.get('states');

      const tracts = mapFeatures.get('tracts');
      /**
       * Re-project cluster nodes.
       * Everything else is scaled w/ un-modified original projection
       * @private
       */
      projectionModify
        .translate([(initialTranslate[0] * transform.k) + transform.x,
          (initialTranslate[1] * transform.k) + transform.y])
        .scale(initialScale * transform.k);
      if (scale === 'national') {
        zoomStates({
          states,
          transform,
        });

        zoomAgencies({
          agencies,
          projectionModify,
        });
      } else if (scale === 'msa') {
        zoomTracts({
          tracts,
          transform,
        });
      }
    };
  },
  setZoomEvents({
    zoomed,
    mapSVG,
  }) {
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', zoomed);
    mapSVG.call(zoom);
  },

  getRadiusScale({
    nationalMapData,
  }) {
    const {
      getAllAgencies,
    } = atlasHelperFunctions;


    const allAgencies = getAllAgencies({ nationalMapData });

    const values = allAgencies.map(d => d.upt2017);

    return d3.scaleSqrt()
      .domain(d3.extent(values))
      .range([5, 35]);
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
    nationalMapData,
    nationalDataView,
    // radiusScale,
  }) {
    const {
      getAgenciesTable,
    } = atlasMethods;

    const agenciesTable = getAgenciesTable({ nationalMapData, nationalDataView });

    return nodes
      .map((node) => {
        const nodeCopy = Object.assign({}, node);
        const agency = agenciesTable[node.globalId];
        if (agency === undefined) return nodeCopy;
        nodeCopy.pctChange = agency.pctChange;
        // nodeCopy.uptTotal = agency.uptTotal;
        // nodeCopy.radius = radiusScale(agency.uptTotal);
        return nodeCopy;
      });
  },
  updateAgencyRadii({
    agencies,
    // radiusScale,
    nationalMapData,
    nodes,
    changeColorScale,
    nationalDataView,
  }) {
    const {
      getUpdatedNodes,
    } = atlasMethods;
    const updatedNodes = getUpdatedNodes({
      nodes,
      nationalMapData,
      nationalDataView,
      // radiusScale,
    });
    // console.log('updatednodes', updatedNodes);
    agencies
      .data(updatedNodes, d => d.taId)
      .transition()
      .duration(500)
      .attrs({
        // r: d => d.radius,
        fill: d => (d.pctChange === null ? 'lightgrey' : changeColorScale(d.pctChange)),
      });
  },
  setAgencyColors({
    agencies,
    changeColorScale,
    nationalMapData,
    nodes,
    nationalDataView,
    // radiusScale,
  }) {
    const {
      getUpdatedNodes,
    } = atlasMethods;
    const updatedNodes = getUpdatedNodes({
      nodes,
      nationalMapData,
      nationalDataView,
      // radiusScale,
    });

    agencies
      .data(updatedNodes, d => d.globalId)
      .transition()
      .duration(500)
      .attrs({
        fill: d => (d.pctChange === null ? 'lightgrey' : changeColorScale(d.pctChange)),
      });
  },
};

export default atlasMethods;
