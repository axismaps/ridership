import * as topojsonBase from 'topojson-client';
import * as topojsonSimplify from 'topojson-simplify';
import atlasHelperFunctions from './atlasHelperFunctions';

const topojson = Object.assign({}, topojsonBase, topojsonSimplify);

const atlasNationalFunctions = {
  getRadiusScale({
    nodes,
  }) {
    const domain = d3.extent(nodes, d => d.firstAndLast[1]);

    const scale = d3.scaleSqrt()
      .domain(domain)
      .range([5, 35]);

    return d => (d === null ? 0 : scale(d));
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
  setAgencyNodes({
    nationalMapData,
    radiusScale,
    projectionModify,
    logSimulationNodes,
  }) {
    const {
      getAllAgencies,
    } = atlasHelperFunctions;

    const allAgencies = getAllAgencies({ nationalMapData });
    const nodes = allAgencies.map(agency => ({
      msaId: agency.msaId,
      taId: agency.taId,
      radius: radiusScale(agency.upt2017),
      x: projectionModify(agency.cent)[0],
      y: projectionModify(agency.cent)[1],
      xOriginal: projectionModify(agency.cent)[0],
      yOriginal: projectionModify(agency.cent)[1],
      cent: agency.cent,
      pctChange: agency.pctChange,
      upt2017: agency.upt2017,
      msaName: agency.msaName,
      taName: agency.taName,
      globalId: agency.globalId,
      firstAndLast: agency.firstAndLast,
      actualYearRange: agency.actualYearRange,
    }));


    const simulation = d3.forceSimulation()
      .force('x', d3.forceX().x(d => d.x))
      .force('y', d3.forceY().y(d => d.y))
      .force('collide', d3.forceCollide(d => d.radius))
      .nodes(nodes)
      .stop();

    for (let i = 0; i < 300; i += 1) {
      simulation.tick();
    }


    logSimulationNodes(nodes);
  },
  drawAgencies({
    layer,
    changeColorScale,
    nodes,
  }) {
    const agencies = layer.selectAll('.map__agency')
      .data(nodes, d => d.globalId);

    const newAgencies = agencies
      .enter()
      .append('circle');

    agencies.exit().remove();

    const mergedAgencies = newAgencies.merge(agencies)
      .attrs({
        cx: d => d.xOriginal,
        cy: d => d.yOriginal,
        r: 0,
        class: 'map__agency',
        fill: d => changeColorScale(d.pctChange),
      });


    mergedAgencies
      .transition()
      .duration(500)
      .attrs({
        // cx: d => d.x,
        // cy: d => d.y,
        r: d => d.radius,
        fill: d => (d.pctChange === null ? 'lightgrey' : changeColorScale(d.pctChange)),
      });


    return mergedAgencies;
  },
  zoomAgencies({
    agencies,
    projectionModify,
  }) {
    const getCenter = ({
      d,
      original,
      unshiftedPos,
    }) => {
      const change = d - original;
      return unshiftedPos + change;
    };

    agencies.attrs({
      cx: d => getCenter({
        d: d.x,
        original: d.xOriginal,
        unshiftedPos: projectionModify(d.cent)[0],
      }),
      cy: d => getCenter({
        d: d.y,
        original: d.yOriginal,
        unshiftedPos: projectionModify(d.cent)[1],
      }),
    });
  },
  zoomStates({
    states,
    transform,
  }) {
    states.attrs({
      transform: `translate(${transform.x},${transform.y})scale(${transform.k})`,
      'stroke-width': 1.5 / transform.k,
    });
  },
  setMSANodes({
    nationalMapData,
    radiusScale,
    projectionModify,
    logSimulationNodes,
  }) {
    const msaNodes = nationalMapData.map(msa => ({
      msaId: msa.msaId,
      radius: radiusScale(msa.upt2017),
      x: projectionModify(msa.cent)[0],
      y: projectionModify(msa.cent)[1],
      xOriginal: projectionModify(msa.cent)[0],
      yOriginal: projectionModify(msa.cent)[1],
      cent: msa.cent,
      pctChange: msa.pctChange,
      upt2017: msa.upt2017,
      name: msa.name,
      globalId: msa.globalId,
      firstAndLast: msa.firstAndLast,
      actualYearRange: msa.actualYearRange,
    }));

    const simulation = d3.forceSimulation()
      .force('x', d3.forceX().x(d => d.x))
      .force('y', d3.forceY().y(d => d.y))
      // .force('collide', d3.forceCollide(d => d.radius * 0.8))
      .force('collide', d3.forceCollide(d => d.radius))
      .nodes(msaNodes)
      .stop();

    for (let i = 0; i < 300; i += 1) {
      simulation.tick();
    }
    logSimulationNodes(msaNodes);
  },
  drawMSAs({
    layer,
    changeColorScale,
    msaNodes,
  }) {
    const msas = layer.selectAll('.map__agency')
      .data(msaNodes, d => d.globalId);

    const newMSAa = msas
      .enter()
      .append('circle');

    msas.exit().remove();

    const mergedMSAs = newMSAa.merge(msas)
      .attrs({
        r: 0,
        class: 'map__agency',
        fill: d => changeColorScale(d.pctChange),
      });


    mergedMSAs
      .transition()
      .duration(500)
      .attrs({
        r: d => d.radius,
        fill: d => (d.pctChange === null ? 'lightgrey' : changeColorScale(d.pctChange)),
      });


    return mergedMSAs;
  },
  setNodePositions({
    nodes,
    radiusScale,
    logSimulationNodes,
  }) {
    for (let i = 0; i < nodes.length; i += 1) {
      const node = nodes[i];
      node.x = node.xOriginal;
      node.y = node.yOriginal;
      node.radius = radiusScale(node.firstAndLast[1]);
    }

    const simulation = d3.forceSimulation()
      .force('x', d3.forceX().x(d => d.x))
      .force('y', d3.forceY().y(d => d.y))
      .force('collide', d3.forceCollide(d => d.radius))
      .nodes(nodes)
      .stop();

    for (let i = 0; i < 300; i += 1) {
      simulation.tick();
    }
    logSimulationNodes(nodes);
  },

  getUpdatedNodes({
    nodes,
    msaNodes,
    nationalMapData,
  }) {
    const taTable = nationalMapData
      .reduce((accumulator, msa) => {
        msa.ta.forEach((ta) => {
          accumulator[ta.globalId] = ta;
        });
        return accumulator;
      }, {});
    const msaTable = nationalMapData
      .reduce((accumulator, msa) => {
        accumulator[msa.globalId] = msa;
        return accumulator;
      }, {});
    return {
      nodes: nodes
        .map((node) => {
          const nodeCopy = Object.assign({}, node);
          const agency = taTable[node.globalId];
          if (agency === undefined) return nodeCopy;
          nodeCopy.pctChange = agency.pctChange;
          nodeCopy.firstAndLast = agency.firstAndLast;
          nodeCopy.actualYearRange = agency.actualYearRange;
          return nodeCopy;
        }),
      msaNodes: msaNodes
        .map((node) => {
          const nodeCopy = Object.assign({}, node);
          const agency = msaTable[node.globalId];
          if (agency === undefined) return nodeCopy;
          nodeCopy.pctChange = agency.pctChange;
          nodeCopy.firstAndLast = agency.firstAndLast;
          nodeCopy.actualYearRange = agency.actualYearRange;
          return nodeCopy;
        }),
    };
  },
  updateRadii({
    agencies,
  }) {
    agencies
      .transition('radius')
      .duration(500)
      .attr('r', d => d.radius);
  },
};

export default atlasNationalFunctions;
