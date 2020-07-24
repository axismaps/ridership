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
    // when nominal value is selected, end year could be the same as start year
    const years = [yearRange[0], Math.max(yearRange[1], yearRange[0] + 1)];
    const { agencies } = indicatorData;
    const values = agencies.map(d => d.summaries)
      .reduce((accumulator, d) => [...accumulator, ...d], [])
      .filter(d => d.year >= years[0] && d.year <= years[1]);
    const xDomain = years;
    const yDomain = agencies.length > 1 ? [-2, 2] : d3.extent(values, d => d.indicatorSummary);

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
    const { agencies } = indicatorData;
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
        if (indicatorData.agencies.length > 1) return d;
        const digits = Math.min(9, Math.floor(Math.log10(d) / 3) * 3);
        const suffixes = ['', 'k', 'M', 'B'];
        if (digits < 3) return d3.format(indicatorData.format)(d);
        const shortNumber = +d3.format('.2f')(d / (10 ** digits));
        return (indicatorData.format.includes('$') ? '$' : '') + shortNumber + suffixes[digits / 3] + (indicatorData.format.includes('%') ? '%' : '');
      })
      .tickSize(xScale.range()[1] + 5);

    svg.append('g')
      .attr('transform', `translate(${xScale.range()[1] + 4 * margin},${margin})`)
      .attr('class', `sparkline-axis sparkline-axis-${agencies.length > 1 ? 'multiple' : 'single'}`)
      .call(axis);

    if (indicatorData.unit) {
      svg.append('text')
        .attr('class', 'sparkline-y-label')
        .text(indicatorData.unit)
        .attr('x', 20)
        .attr('y', yScale.range()[0] / 2 + margin)
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'middle')
        .attr('transform-origin', `20 ${yScale.range()[0] / 2 + margin}`)
        .attr('transform', 'rotate(-90)')
        .style('font-size', '12px')
        .style('fill', '#666');
    }

    return axis;
  },
  drawYearAxis({
    svg,
    scales,
    margin,
  }) {
    const {
      xScale,
      yScale,
    } = scales;

    const yearAxis = d3.axisBottom()
      .scale(xScale)
      .tickValues(xScale.domain())
      .tickFormat(d3.format('d'));
    svg.append('g')
      .attr('transform', `translate(${4 * margin},${margin + yScale.range()[0] - 5})`)
      .attr('class', 'sparkline-axis sparkline-year-axis')
      .call(yearAxis);

    return yearAxis;
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
    const domain = xScale.domain();
    const lineGenerator = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.indicatorSummary))
      .defined(d => d.indicatorSummary !== null && d.year >= domain[0] && d.year <= domain[1]);

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
              stroke: d.compareColor || d.color,
              'stroke-width': 1,
            });
        }
      })
      .attr('d', (d) => {
        if (indicatorData.agencies.length > 1) {
          if (d.scale === undefined) return '';
          lineGenerator.y(s => yScale(d.scale(s.indicatorSummary)));
        }

        return lineGenerator(d.summaries);
      });

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
    interactive,
    embedded,
    currentScale,
  }) {
    if (interactive === false) return svg;
    return svg.on('mousemove click', (d) => {
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
      if (year >= xScale.domain()[0] && year <= xScale.domain()[1]) {
        const format = value => (value === null
          ? 'N/A'
          : (d3.format(d.format)(value) + (d.unit || '')));
        const summaries = d.agencies.map(a => a.summaries.find(s => s.year === year));
        const displayValues = d.agencies.map((agency) => {
          const summaryData = agency.summaries.find(s => s.year === year);
          const summary = summaryData ? summaryData.indicatorSummary : null;
          if (agency.globalId === 'all') return format(summary);
          return `<span class="data-probe__field">${(agency.name || agency.taShort || agency.taName)}:</span> ${format(summary)}`;
        })
          .map(val => `<div class="data-probe__row">${val}</div>`)
          .join('');
        let html = `
            <div class="data-probe__row"><span class="data-probe__field">${year}</span><span class="mobile"> ${d.text}</span></div>
            ${displayValues}
          `;
        if (!embedded && currentScale === 'national') {
          html += '<div class="data-probe__row data-probe__msa-text desktop">Click to show on map</div>';
        }
        dataProbe
          .config({
            pos,
            html,
          })
          .draw();

        svg.selectAll('circle')
          .attrs({
            cx: xScale(year),
            cy: (circleData, i) => {
              if (summaries[i] === undefined) return 0;
              return d.agencies.length > 1 && d.agencies[i].scale !== undefined
                ? yScale(d.agencies[i].scale(summaries[i].indicatorSummary))
                : yScale(summaries[i].indicatorSummary);
            },
          })
          .style('display', (circleData, i) => (summaries[i] !== undefined && summaries[i].indicatorSummary !== null ? 'block' : 'none'));
      } else {
        svg.selectAll('circle').style('display', 'none');
      }
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

    const domain = xScale.domain();

    const lineGenerator = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.indicatorSummary))
      .defined(d => d.indicatorSummary !== null && d.year >= domain[0] && d.year <= domain[1]);

    line
      .data(indicatorData.agencies)
      .transition()
      .attr('d', (d) => {
        if (indicatorData.agencies.length > 1) {
          if (d.scale === undefined) return '';
          lineGenerator.y(s => yScale(d.scale(s.indicatorSummary)));
        }
        return lineGenerator(d.summaries);
      });

    axis
      .scale(yScale)
      .ticks(expanded ? 4 : 2);

    svg.select('g.sparkline-axis')
      .call(axis);

    svg.select('.sparkline-y-label')
      .attr('transform-origin', `20 ${yScale.range()[0] / 2 + margin}`)
      .attr('y', yScale.range()[0] / 2 + margin);
  },
};

export default sparkLineFunctions;
