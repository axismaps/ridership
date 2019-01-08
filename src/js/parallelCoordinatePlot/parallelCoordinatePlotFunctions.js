
const parallelCoordinatePlotFunctions = {
  drawIndicators({
    pcpContainer,
    indicatorSummaries,
    indicatorHeight,
    // margins,
    updateIndicator,
  }) {
    const indicatorsContainer = pcpContainer.append('div')
      .attr('class', 'sidebar__pcp-labels');

    indicatorsContainer.selectAll('.sidebar__pcp-row')
      .data(indicatorSummaries, d => d.value)
      .enter()
      .append('div')
      .attr('class', 'sidebar__pcp-row')
      .style('height', `${indicatorHeight}px`)
      .on('click', (d) => {
        const { summaries, ...indicator } = d;
        updateIndicator(indicator);
      })
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
      .attr('class', 'pcp-ticks')
      .attr('transform', `translate(${margins[1]},${margins[0]})`)
      .selectAll('path')
      .data(indicatorSummaries)
      .enter()
      .append('path')
      .attr('d', (d, i) => `M0,${i * indicatorHeight}H${width - 2 * margins[1]}`);

    svg.append('g')
      .attr('class', 'pcp-lines')
      .attr('transform', `translate(${margins[1]},${margins[0]})`);

    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${margins[1]},${margins[0]})`);

    svg.append('g')
      .attr('class', 'probe-dot')
      .attr('transform', `translate(${margins[1]},${margins[0]})`)
      .append('circle')
      .attr('r', 5)
      .style('display', 'none');

    return svg;
  },
  getXScale({
    agenciesData,
    width,
    margins,
    maxValue,
  }) {
    const extent = d3.extent(
      agenciesData
        .reduce((accumulator, agency) => {
          const values = agency.indicators.map(d => d.pctChange);
          return [...accumulator, ...values];
        }, []),
    )
      .filter(d => d !== null)
      .map(d => Math.max(Math.min(d, maxValue), -maxValue));

    return d3.scaleLinear().domain(extent).range([0, width - 2 * margins[1]]).clamp(true);
  },
  drawLines({
    agenciesData,
    indicatorHeight,
    svg,
    xScale,
    dataProbe,
    updateHighlightedAgencies,
    color,
    msaScale,
  }) {
    console.log('agenciesData--PCP', agenciesData);
    const lineGenerator = d3.line()
      .x(d => xScale(d.pctChange))
      .y((d, i) => i * indicatorHeight);
      // .defined(d => d.pctChange !== null);

    const lines = svg.select('g.pcp-lines').selectAll('path.pcp-line')
      .data(agenciesData, d => d.globalId);

    const newLines = lines
      .enter()
      .append('path')
      .style('fill', 'none')
      .style('stroke', d => (msaScale ? d.color : color()))
      // .style('stroke', color)
      .style('opacity', 0)
      .attr('class', 'pcp-line')
      .attr('d', d => lineGenerator(d.indicators))
      .on('mouseout', () => {
        dataProbe.remove();
        svg.select('.probe-dot circle')
          .style('display', 'none');
        updateHighlightedAgencies([]);
      });

    lines.exit().remove();

    const mergedLines = newLines
      .merge(lines);

    mergedLines

      .on('mouseover', (d) => {
        updateHighlightedAgencies([d]);
      })
      .on('mousemove', (d) => {
        dataProbe.remove();
        d3.select(this).raise();
        const { clientX, clientY } = d3.event;
        const pos = {
          left: clientX + 10,
          bottom: window.innerHeight - clientY + 10,
          width: 250,
        };
        const svgTop = svg.select('g.pcp-lines').node().getBoundingClientRect().top;
        const closest = Math.round((clientY - svgTop) / indicatorHeight);
        const displayValue = d.indicators[closest].pctChange === null ? 'N/A' : (`${Math.round(d.indicators[closest].pctChange)}%`);
        const html = `
          <div class="data-probe__row"><span class="data-probe__field">${d.taName || d.name}</span></div>
          <div class="data-probe__row">${d.indicators[closest].text}: ${displayValue}</div>
          <div class="data-probe__row data-probe__msa-text">Click to jump to this MSA</div>
        `;
        dataProbe
          .config({
            pos,
            html,
          })
          .draw();
        svg.select('.probe-dot circle')
          .attrs({
            cx: xScale(d.indicators[closest].pctChange),
            cy: closest * indicatorHeight,
          })
          .style('display', 'block')
          .style('fill', color(d));
      })
      .transition()
      .attr('d', d => lineGenerator(d.indicators))
      .style('stroke', d => (msaScale ? d.color : color()))
      .style('opacity', agenciesData.length < 15 ? 0.75 : 0.1);

    return mergedLines;
  },
  drawAxis({
    svg,
    xScale,
  }) {
    const axis = d3.axisTop()
      .scale(xScale)
      .tickFormat(d3.format('+d'))
      .ticks(3);

    return svg.select('g.axis').call(axis);
  },
};

export default parallelCoordinatePlotFunctions;
