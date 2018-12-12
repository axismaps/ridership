

const sparkLineFunctions = {
  drawSVG({
    container,
    height,
    width,
    margin,
  }) {
    return container
      .append('svg')
      .attr('class', 'sidebar__sparkline-svg')
      .styles({
        width: `${width + 3 * margin}px`,
        height: `${height + 2 * margin}px`,
      });
  },
  getScales({
    indicatorData,
    yearRange,
    width,
    height,
  }) {
    const { agencies } = indicatorData;
    const values = agencies.map(d => d.summaries)
      .reduce((accumulator, d) => [...accumulator, ...d], []);
    const xDomain = yearRange;
    const yDomain = d3.extent(values, d => d.indicatorSummary);

    return {
      xScale: d3.scaleLinear()
        .domain(xDomain)
        .range([0, width]),
      yScale: d3.scaleLinear()
        .domain(yDomain)
        .range([height, 0]),
    };
  },
  drawAxis({
    svg,
    scales,
    margin,
    indicatorData,
  }) {
    const {
      xScale,
      yScale,
    } = scales;
    svg.append('rect')
      .attr('class', 'sparkline-background')
      .attrs({
        x: 3 * margin,
        width: xScale.range()[1],
        height: '100%',
      });

    const axis = d3.axisLeft()
      .scale(yScale)
      .ticks(2)
      .tickFormat(d3.format(indicatorData.format))
      .tickSize(xScale.range()[1] + 2 * margin);

    const axisContainer = svg.append('g')
      .attr('transform', `translate(${xScale.range()[1] + 3 * margin},${margin})`)
      .attr('class', 'sparkline-axis')
      .call(axis);

    axisContainer.selectAll('text')
      .attrs({
        'text-anchor': 'start',
        x: -(xScale.range()[1] + 3 * margin) + 5,
        dy: '-.32em',
      });

    return axis;
  },
  drawLine({
    indicatorData,
    svg,
    scales,
    margin,
    color,
  }) {
    const {
      xScale,
      yScale,
    } = scales;
    const lineGenerator = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.indicatorSummary));

    const g = svg.append('g')
      .attr('class', 'sidebar__sparkline-path-container')
      .attr('transform', `translate(${3 * margin},${margin})`);

    g.selectAll('path')
      .data(indicatorData.agencies)
      .enter()
      .append('path')
      .attr('class', 'sidebar__sparkline-path')
      // .style('stroke', d => (d.color !== undefined ? d.color : 'black'))
      .each(function setColor(d) {
        if (color) {
          d3.select(this)
            .styles({
              stroke: d.color,
              'stroke-width': 1,
            });
        }
      })
      .attr('d', d => lineGenerator(d.summaries));

    g.append('circle')
      .attr('r', 5)
      .style('display', 'none');

    return g.selectAll('path');
  },
  updateInteractions({
    svg,
    scales,
    dataProbe,
  }) {
    return svg.on('mousemove', (d) => {
      dataProbe.remove();
      const {
        xScale,
        yScale,
      } = scales;
      const {
        clientX,
        clientY,
      } = d3.event;
      const pos = {
        left: clientX < window.innerWidth - 260 ? (clientX + 10) : clientX - 260,
        bottom: window.innerHeight - clientY + 10,
        width: 250,
      };
      const x = clientX - svg.select('.sparkline-background').node().getBoundingClientRect().left;
      const year = Math.min(Math.round(xScale.invert(x)), xScale.domain()[1]);
      const summary = d.agencies[0].summaries.find(s => s.year === year);
      if (summary === undefined) return;
      const displayValue = summary.indicatorSummary === null
        ? 'N/A'
        : d3.format(d.format)(summary.indicatorSummary);
      const html = `
          <div class="data-probe__row"><span class="data-probe__field">${year}</span></div>
          <div class="data-probe__row">${displayValue}</div>
          <div class="data-probe__row data-probe__msa-text">Click to show on map</div>
        `;
      dataProbe
        .config({
          pos,
          html,
        })
        .draw();

      svg.select('circle')
        .attrs({
          cx: xScale(year),
          cy: yScale(summary.indicatorSummary),
        })
        .style('display', 'block');
    })
      .on('mouseout', () => {
        dataProbe.remove();
        svg.select('circle')
          .style('display', 'none');
      });
  },
  updateSparkline({
    expanded,
    svg,
    line,
    scales,
    width,
    height,
    margin,
    indicatorData,
    axis,
  }) {
    svg
      .transition()
      .styles({
        height: `${height + 2 * margin}px`,
      });

    const {
      xScale,
      yScale,
    } = scales;

    const lineGenerator = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.indicatorSummary));

    line
      .data(indicatorData.agencies)
      .transition()
      .attr('d', d => lineGenerator(d.summaries));

    axis
      .scale(yScale)
      .ticks(expanded ? 4 : 2);

    svg.select('g.sparkline-axis')
      .call(axis)
      .selectAll('text').attrs({
        'text-anchor': 'start',
        x: -(xScale.range()[1] + 2 * margin) + 5,
        dy: '-.32em',
      });

    return line;
  },
};

export default sparkLineFunctions;
