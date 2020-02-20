
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
      .attr('class', 'pcp-dots')
      .attr('transform', `translate(${margins[1]},${margins[0]})`);

    svg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(${margins[1]},${margins[0]})`);

    svg.append('g')
      .attr('class', 'probe-dot')
      .attr('transform', `translate(${margins[1]},${margins[0]})`)
      .append('circle')
      .attr('r', 3)
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
    updateMSA,
    mobile,
  }) {
    const getProbeText = (agency, indicator) => {
      const format = number => ([null, undefined].includes(number) ? 'N/A'
        : (d3.format(indicator.format)(number) + (indicator.unit || '')));
      const displayValue = indicator.pctChange === null ? 'N/A' : (`${Math.round(indicator.pctChange)}%`);
      let clickText;
      if (mobile) {
        clickText = 'Jump to this MSA';
      } else {
        clickText = 'Click to jump to this MSA';
      }
      return `
        <div class="data-probe__row"><span class="data-probe__field">${agency.taName || agency.name}</span></div>
        <div class="data-probe__row">${indicator.text}</div>
        <div class="data-probe__row"><span class="data-probe__field">${indicator.actualYearRange[0]}:</span> ${format(indicator.firstAndLast[0])}</div>
      <div class="data-probe__row"><span class="data-probe__field">${indicator.actualYearRange[1]}:</span> ${format(indicator.firstAndLast[1])}</div>
        <div class="data-probe__row"><span class="data-probe__field">${indicator.actualYearRange.join('–')} (% change):</span> ${displayValue}</div>
        ${!msaScale ? `<div class="data-probe__row data-probe__msa-text">${clickText}</div>` : ''}
      `;
    };
    const lineGenerator = d3.line()
      .x(d => xScale(d.pctChange))
      .y((d, i) => i * indicatorHeight)
      .defined(d => d.pctChange !== null);

    svg.select('g.pcp-dots').selectAll('g')
      .remove();

    // dots to make indicators visible if they're between two missing values
    if (agenciesData.length <= 10) { // but only if there aren't a ton of agencies on the chart
      svg.select('g.pcp-dots').selectAll('g')
        .data(agenciesData, d => d.globalId)
        .enter()
        .append('g')
        .each(function addDots(agency) {
          const { indicators } = agency;
          indicators.forEach((indicator, i) => {
            if (indicator.pctChange !== null) {
              if ((i === 0 || indicators[i - 1].pctChange === null)
              && (i === indicators.length - 1 || indicators[i + 1].pctChange === null)) {
                d3.select(this)
                  .append('circle')
                  .attr('class', 'pcp-dot')
                  .attr('r', 2)
                  .attr('cx', xScale(indicator.pctChange))
                  .attr('cy', i * indicatorHeight)
                  .on('mouseover', () => {
                    if (mobile) return;
                    updateHighlightedAgencies([agency]);
                    dataProbe.remove();
                    d3.select(this).raise();
                    const { clientX, clientY } = d3.event;
                    const pos = {
                      left: clientX + 10,
                      bottom: window.innerHeight - clientY + 10,
                      width: 250,
                    };
                    const html = getProbeText(agency, indicator);
                    dataProbe
                      .config({
                        pos,
                        html,
                      })
                      .draw();
                    if (mobile) {
                      d3.select('.data-probe__msa-text')
                        .on('click', () => {
                          updateMSA(agency);
                          dataProbe.remove();
                        });
                    }
                  })
                  .on('mouseout', () => {
                    if (mobile) return;
                    dataProbe.remove();
                    svg.select('.probe-dot circle')
                      .style('display', 'none');
                    updateHighlightedAgencies([]);
                  });
              }
            }
          });
        });
    }

    const lines = svg.select('g.pcp-lines').selectAll('path.pcp-line')
      .data(agenciesData, d => d.globalId);

    const newLines = lines
      .enter()
      .append('path')
      .style('fill', 'none')
      .style('stroke', d => (msaScale ? d.color : color()))
      .style('opacity', 0)
      .attr('class', 'pcp-line')
      .attr('d', d => lineGenerator(d.indicators))
      .on('mouseout', () => {
        if (mobile) return;
        dataProbe.remove();
        svg.select('.probe-dot circle')
          .style('display', 'none');
        updateHighlightedAgencies([]);
      })
      .on('click', (d) => {
        if (!mobile) updateMSA(d);
        // move probe code to own function
        // call here for mobile
      });

    lines.exit().remove();

    const mergedLines = newLines
      .merge(lines);

    mergedLines

      .on('mouseover', (d) => {
        if (mobile) return;
        updateHighlightedAgencies([d]);
      })
      .on('mousemove', (d) => {
        if (mobile) return;
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
        const closestIndicator = d.indicators[closest];
        const html = getProbeText(d, closestIndicator);
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
        if (mobile) {
          d3.select('.data-probe__msa-text')
            .on('click', () => {
              updateMSA(d);
              dataProbe.remove();
            });
        }
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
