

const sparkLineFunctions = {
  drawSVG({
    container,
    height,
    width,
  }) {
    return container
      .append('svg')
      .attr('class', 'sidebar__sparkline-svg')
      .styles({
        width: `${width}px`,
        height: `${height}px`,
      });
  },
  getScales({
    indicatorData,
    yearRange,
    width,
    height,
  }) {
    const { summaries } = indicatorData;
    const xDomain = yearRange;
    const yDomain = d3.extent(summaries, d => d.indicatorSummary);

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
    const axis = d3.axisRight()
      .scale(yScale)
      .ticks(4)
      .tickSize(xScale.range()[1]);

    return svg.append('g')
      .attr('class', 'sidebar__sparkline-axis')
      .call(axis);
  },
  drawLine({
    indicatorData,
    svg,
    scales,
  }) {
    const {
      xScale,
      yScale,
    } = scales;
    const lineGenerator = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.indicatorSummary));

    const line = svg.append('path')
      .data([indicatorData.summaries])
      .attrs({
        class: 'sidebar__sparkline-path',
        d: lineGenerator,
      });

    svg.append('circle')
      .attr('r', 5)
      .style('display', 'none');

    return line;
  },
  updateInteractions({
    indicatorData,
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
      const x = clientX - svg.node().getBoundingClientRect().left;
      const year = Math.min(Math.round(xScale.invert(x)), xScale.domain()[1]);
      const i = year - xScale.domain()[0];
      if (d.summaries[i] === undefined) return;
      const format = (number) => {
        if (number < 100) return d3.format('.2r')(number);
        return d3.format(',d')(number);
      };
      const displayValue = d.summaries[i].indicatorSummary === null ? 'N/A' : format(d.summaries[i].indicatorSummary);
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
          cy: yScale(d.summaries[i].indicatorSummary),
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
  }) {
    svg
      .transition()
      .styles({
        width: `${width}px`,
        height: `${height}px`,
      });

    const {
      xScale,
      yScale,
    } = scales;

    const lineGenerator = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.indicatorSummary));

    line
      .transition()
      .attr('d', lineGenerator);

    if (expanded) {
      const axis = d3.axisRight()
        .scale(yScale)
        .ticks(4)
        .tickSize(xScale.range()[1]);

      svg.select('g.sidebar__sparkline-axis')
        .transition()
        .call(axis);
    }

    return line;
  },
};

export default sparkLineFunctions;
