import * as topojsonBase from 'topojson-client';
import * as topojsonSimplify from 'topojson-simplify';
import atlasHelperFunctions from './atlasHelperFunctions';

const topojson = Object.assign({}, topojsonBase, topojsonSimplify);

const atlasNationalFunctions = {
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
  drawAgencies({
    nationalMapData,
    layer,
    projectionModify,
    changeColorScale,
    logSimulationNodes,
    // dataProbe,
    radiusScale,
    // jumpToMsa,
    // updateHighlightedAgencies,
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
    }));

    const agencies = layer.selectAll('.map__agency')
      .data(nodes, d => d.globalId);

    // const formatPct = d3.format(',d');

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

    const layoutTick = () => {
      mergedAgencies
        .transition()
        .duration(500)
        .attrs({
          cx: d => d.x,
          cy: d => d.y,
          r: d => d.radius,
          fill: d => (d.pctChange === null ? 'lightgrey' : changeColorScale(d.pctChange)),
        });
    };

    const simulation = d3.forceSimulation()
      .force('x', d3.forceX().x(d => d.x))
      .force('y', d3.forceY().y(d => d.y))
      // .force('collide', d3.forceCollide(d => d.radius * 0.8))
      .force('collide', d3.forceCollide(d => d.radius))
      .nodes(nodes)
      .stop();

    for (let i = 0; i < 300; i += 1) {
      simulation.tick();
    }

    layoutTick();
    if (logSimulationNodes !== undefined) {
      logSimulationNodes(nodes);
    }


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
  drawMSAs({
    nationalMapData,
    layer,
    projectionModify,
    changeColorScale,
    logSimulationNodes,
    // dataProbe,
    radiusScale,
    // jumpToMsa,
    // updateHighlightedAgencies,
  }) {
    const nodes = nationalMapData.map(msa => ({
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
    }));

    const msas = layer.selectAll('.map__agency')
      .data(nodes, d => d.globalId);

    // const formatPct = d3.format(',d');

    const newMSAa = msas
      .enter()
      .append('circle');

    msas.exit().remove();

    const mergedMSAs = newMSAa.merge(msas)
      .attrs({
        cx: d => d.xOriginal,
        cy: d => d.yOriginal,
        r: 0,
        class: 'map__agency',
        fill: d => changeColorScale(d.pctChange),
      });

    const layoutTick = () => {
      mergedMSAs
        .transition()
        .duration(500)
        .attrs({
          cx: d => d.x,
          cy: d => d.y,
          r: d => d.radius,
          fill: d => (d.pctChange === null ? 'lightgrey' : changeColorScale(d.pctChange)),
        });
    };

    const simulation = d3.forceSimulation()
      .force('x', d3.forceX().x(d => d.x))
      .force('y', d3.forceY().y(d => d.y))
      // .force('collide', d3.forceCollide(d => d.radius * 0.8))
      .force('collide', d3.forceCollide(d => d.radius))
      .nodes(nodes)
      .stop();

    for (let i = 0; i < 300; i += 1) {
      simulation.tick();
    }

    layoutTick();
    if (logSimulationNodes !== undefined) {
      logSimulationNodes(nodes);
    }

    return mergedMSAs;
  },
};

export default atlasNationalFunctions;
