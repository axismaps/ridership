
const parallelCoordinatePlotFunctions = {
  drawIndicators({
    pcpContainer,
    indicatorSummaries,
  }) {
    const indicatorsContainer = pcpContainer.append('div')
      .attr('class', 'sidebar__pcp-labels');

    indicatorsContainer.selectAll('.sidebar__pcp-row')
      .data(indicatorSummaries, d => d.value)
      .enter()
      .append('div')
      .attr('class', 'sidebar__pcp-row')
      .append('p')
      .html(d => d.text);

    return indicatorsContainer;
  },
  drawSVG({
    pcpContainer,
    indicatorSummaries,
    indicatorHeight,
    width,
    margins,
  }) {
    const svg = pcpContainer
      .append('svg')
      .attr('class', 'sidebar__pcp-svg')
      .styles({
        width: `${width}px`,
        height: `${indicatorHeight * indicatorSummaries.length}px`,
      });

    svg.append('g')
      .attr('class', 'pcp-lines')
      .attr('transform', `translate(${margins[1]},${margins[0]})`);

    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${margins[1]},${margins[0]})`);

    return svg;
  },
  getXScale({
    allAgenciesData,
    width,
    margins,
  }) {
    const extent = d3.extent(
      allAgenciesData
        .reduce((accumulator, agency) => {
          const values = agency.indicators.map(d => d.pctChange);
          return [...accumulator, ...values];
        }, []),
    )
      .filter(d => d !== null)
      .map(d => Math.max(Math.min(d, 200), -200));

    return d3.scaleLinear().domain(extent).range([0, width - 2 * margins[1]]).clamp(true);
  },
  drawLines({
    allAgenciesData,
    indicatorHeight,
    svg,
    xScale,
  }) {
    const lineGenerator = d3.line()
      .x(d => xScale(d.pctChange))
      .y((d, i) => i * indicatorHeight);
      // .defined(d => d.pctChange !== null);

    const indicatorsData = allAgenciesData.map(d => d.indicators);
    const lines = svg.select('g.pcp-lines').selectAll('path.pcp-line')
      .data(indicatorsData, d => d.taId);

    const newLines = lines
      .enter()
      .append('path')
      .style('fill', 'none')
      .style('stroke', 'rgba(0,0,0,.1)')
      .attr('class', 'pcp-line');

    const mergedLines = newLines.merge(lines);

    mergedLines
      .attr('d', lineGenerator);

    return mergedLines;
  },
  drawAxis({
    svg,
    xScale,
  }) {
    const axis = d3.axisTop()
      .scale(xScale)
      .ticks(5);

    return svg.select('g.axis').call(axis);
  },
};

export default parallelCoordinatePlotFunctions;
