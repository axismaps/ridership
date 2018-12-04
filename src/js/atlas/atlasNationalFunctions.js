import atlasFunctions from './atlasFunctions';

const atlasNationalFunctions = {
  drawAgencies({
    nationalMapData,
    layer,
    projectionModify,
    changeColorScale,
    logSimulationNodes,
    dataProbe,
    radiusScale,
    jumpToMsa,
  }) {
    const {
      getAllAgencies,
    } = atlasFunctions;

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
    }));

    const agencies = layer.selectAll('.map__agency')
      .data(nodes, d => d.taId);

    const formatPct = d3.format(',d');

    const newAgencies = agencies
      .enter()
      .append('circle')
      .attrs({
        cx: d => d.xOriginal,
        cy: d => d.yOriginal,
        r: 0,
        class: 'map__agency',
        fill: d => changeColorScale(d.pctChange),
      })
      .on('mouseover', (d) => {
        console.log(d);
        const { clientX, clientY } = d3.event;
        const pos = {
          left: clientX < window.innerWidth - 260 ? (clientX + 10) : clientX - 260,
          bottom: window.innerHeight - clientY + 10,
          width: 250,
        };
        const html = `
          <div class="data-probe__row"><span class="data-probe__field">MSA:</span> ${d.msaName}</div>
          <div class="data-probe__row"><span class="data-probe__field">Agency:</span> ${d.taName}</div>
          <div class="data-probe__row"><span class="data-probe__field">Percent Change:</span> ${formatPct(d.pctChange)}%</div>
          <div class="data-probe__row data-probe__msa-text">Click to jump to this MSA</div>
        `;
        dataProbe
          .config({
            pos,
            html,
          })
          .draw();
      })
      .on('mouseout', () => {
        dataProbe.remove();
      })
      .on('click', (d) => {
        jumpToMsa(d);
      });

    agencies.exit().remove();

    const mergedAgencies = newAgencies.merge(agencies);

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
};

export default atlasNationalFunctions;
