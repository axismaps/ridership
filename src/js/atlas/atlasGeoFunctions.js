
import * as topojsonBase from 'topojson-client';
import * as topojsonSimplify from 'topojson-simplify';
import atlasHelperFunctions from './atlasHelperFunctions';
import atlasNationalFunctions from './atlasNationalFunctions';

const topojson = Object.assign({}, topojsonBase, topojsonSimplify);

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
  getGeoData({
    statesTopo,
  }) {
    return {
      statesGeo: topojson.feature(
        statesTopo,
        statesTopo.objects.admin1_polygons,
      ),
    };
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
    states,
    getAgencies,
    initialScale,
    initialTranslate,
    projectionModify,
    setCurrentTransform,
  }) {
    const {
      zoomAgencies,
    } = atlasNationalFunctions;
    return () => {
      const { transform } = d3.event;
      setCurrentTransform(transform);

      const agencies = getAgencies();
      /**
       * Re-project cluster nodes.
       * Everything else is scaled w/ un-modified original projection
       * @private
       */
      projectionModify
        .translate([(initialTranslate[0] * transform.k) + transform.x,
          (initialTranslate[1] * transform.k) + transform.y])
        .scale(initialScale * transform.k);

      states.attrs({
        transform: `translate(${transform.x},${transform.y})scale(${transform.k})`,
        'stroke-width': 1.5 / transform.k,
      });

      zoomAgencies({
        agencies,
        projectionModify,
      });
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
  drawStates({
    layer,
    statesTopo,
    geoPath,
  }) {
    const simpleTopo = topojson.simplify(topojson.presimplify(statesTopo), 0.001);
    return layer

      .append('path')

      .datum(topojson.feature(simpleTopo, simpleTopo.objects.admin1_polygons))
      .attrs({
        class: 'map__state',
        d: geoPath,
        'stroke-width': 1.5,
      });
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
  }) {
    return nationalMapData
      .reduce((accumulator, msa) => {
        msa.ta.forEach((ta) => {
          accumulator[ta.taId] = ta;
        });
        return accumulator;
      }, {});
  },
  getUpdatedNodes({
    nodes,
    nationalMapData,
    // radiusScale,
  }) {
    const {
      getAgenciesTable,
    } = atlasMethods;

    const agenciesTable = getAgenciesTable({ nationalMapData });

    return nodes
      .map((node) => {
        const nodeCopy = Object.assign({}, node);
        const agency = agenciesTable[node.taId];
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
  }) {
    const {
      getUpdatedNodes,
    } = atlasMethods;
    const updatedNodes = getUpdatedNodes({
      nodes,
      nationalMapData,
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
    // radiusScale,
  }) {
    const {
      getUpdatedNodes,
    } = atlasMethods;
    const updatedNodes = getUpdatedNodes({
      nodes,
      nationalMapData,
      // radiusScale,
    });

    agencies
      .data(updatedNodes, d => d.taId)
      .transition()
      .duration(500)
      .attrs({
        fill: d => (d.pctChange === null ? 'lightgrey' : changeColorScale(d.pctChange)),
      });
  },
};

export default atlasMethods;
