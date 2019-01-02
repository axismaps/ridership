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
        width: `${width + 4 * margin + 10}px`,
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
        x: 4 * margin,
        width: xScale.range()[1],
        height: '100%',
      });

    const axis = d3.axisLeft()
      .scale(yScale)
      .ticks(2)
      .tickFormat((d) => {
        const digits = Math.min(9, Math.floor(Math.log10(d) / 3) * 3);
        const suffixes = ['', 'k', 'M', 'B'];
        if (digits < 3) return d3.format(indicatorData.format)(d);
        const shortNumber = +d3.format('.2f')(d / (10 ** digits));
        return (indicatorData.format.includes('$') ? '$' : '') + shortNumber + suffixes[digits / 3] + (indicatorData.format.includes('%') ? '%' : '');
      })
      .tickSize(xScale.range()[1] + 5);

    svg.append('g')
      .attr('transform', `translate(${xScale.range()[1] + 4 * margin},${margin})`)
      .attr('class', 'sparkline-axis')
      .call(axis);

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
      .attr('transform', `translate(${4 * margin},${margin})`);

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

    const circles = g.append('g')
      .attr('class', 'sparkline-circles')
      .selectAll('circle')
      .data(indicatorData.agencies);

    circles.enter()
      .append('circle')
      .attr('r', 3)
      .style('fill', '#333')
      .style('display', 'none')
      .attr('pointer-events', 'none');

    circles.exit().remove();

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
      const format = value => (value === null
        ? 'N/A'
        : (d3.format(d.format)(value) + (d.unit || '')));
      const summaries = d.agencies.map(a => a.summaries.find(s => s.year === year));
      const displayValues = d.agencies.map((agency) => {
        const summaryData = agency.summaries.find(s => s.year === year);
        const summary = summaryData ? summaryData.indicatorSummary : null;
        if (agency.globalId === 'all') return format(summary);
        return `<span class="data-probe__field">${(agency.name || agency.taShort)}:</span> ${format(summary)}`;
      })
        .map(val => `<div class="data-probe__row">${val}</div>`)
        .join('');
      const html = `
          <div class="data-probe__row"><span class="data-probe__field">${year}</span></div>
          ${displayValues}
          <div class="data-probe__row data-probe__msa-text">Click to show on map</div>
        `;
      dataProbe
        .config({
          pos,
          html,
        })
        .draw();

      svg.selectAll('circle')
        .attrs({
          cx: xScale(year),
          cy: (circleData, i) => (summaries[i] === undefined
            ? 0 : yScale(summaries[i].indicatorSummary)),
        })
        .style('display', (circleData, i) => (summaries[i] !== undefined && summaries[i].indicatorSummary !== null ? 'block' : 'none'));
    })
      .on('mouseleave', () => {
        dataProbe.remove();
        svg.selectAll('circle')
          .style('display', 'none');
      });
  },
  updateSparkline({
    expanded,
    svg,
    line,
    scales,
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
      .call(axis);
  },
};

export default sparkLineFunctions;
