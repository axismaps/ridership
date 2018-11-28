

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

    return svg
      .append('path')
      .data([indicatorData.summaries])
      .attrs({
        class: 'sidebar__sparkline-path',
        d: lineGenerator,
      });
  },
};

export default sparkLineFunctions;
