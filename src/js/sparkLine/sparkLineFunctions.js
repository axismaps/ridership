

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
        width: `${width + 2 * margin}px`,
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
  }) {
    const {
      xScale,
      yScale,
    } = scales;
    svg.append('rect')
      .attr('class', 'sidebar__sparkline-background')
      .attrs({
        width: '100%',
        height: '100%',
      });
    const axis = d3.axisLeft()
      .scale(yScale)
      .ticks(4)
      .tickSize(xScale.range()[1] + 2 * margin);

    return svg.append('g')
      .attr('transform', `translate(${xScale.range()[1] + 2 * margin},${margin})`)
      .attr('class', 'sidebar__sparkline-axis')
      .call(axis);
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
      .attr('transform', `translate(${margin},${margin})`);

    const line = g.selectAll('path')
      .data(indicatorData.agencies)
      .enter()
      .append('path')
      .attr('class', 'sidebar__sparkline-path')
      // .style('stroke', d => (d.color !== undefined ? d.color : 'black'))
      .each(function setColor(d) {
        if (d.color !== undefined) {
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
      const x = clientX - svg.select('.sidebar__sparkline-path').node().getBoundingClientRect().left;
      const year = Math.min(Math.round(xScale.invert(x)), xScale.domain()[1]);
      const i = year - xScale.domain()[0];
      if (d.agencies[0].summaries[i] === undefined) return;
      const format = (number) => {
        if (number < 100) return d3.format('.2r')(number);
        return d3.format(',d')(number);
      };
      const displayValue = d.agencies[0].summaries[i].indicatorSummary === null ? 'N/A' : format(d.agencies[0].summaries[i].indicatorSummary);
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
          cy: yScale(d.agencies[0].summaries[i].indicatorSummary),
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
  }) {
    svg
      .transition()
      .styles({
        width: `${width + 2 * margin}px`,
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

    if (expanded) {
      const axis = d3.axisLeft()
        .scale(yScale)
        .ticks(4)
        .tickFormat((number) => {
          if (number < 10) return d3.format('.2r')(number);
          if (number < 1000) return d3.format('d')(number);
          if (number < 1000000) return `${number / 1000}K`;
          if (number < 1000000000) return `${number / 1000000}M`;
          return `${number / 1000000000}B`;
        })
        .tickSize(xScale.range()[1] + 2 * margin);

      svg.select('g.sidebar__sparkline-axis')
        .call(axis)
        .selectAll('text').attrs({
          'text-anchor': 'start',
          x: -(xScale.range()[1] + 2 * margin) + 5,
          dy: '-.32em',
        });
    }

    return line;
  },
};

export default sparkLineFunctions;
