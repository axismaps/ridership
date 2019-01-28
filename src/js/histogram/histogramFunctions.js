import localFunctions from './histogramLocalFunctions';

const histogramFunctions = {

  getScales({
    width,
    height,
    histogramData,
    padding,
  }) {
    const yDomain = [
      0,
      d3.max(histogramData, d => d.count) + (d3.max(histogramData, d => d.count) * 0.2),
    ];
    const yRange = [
      0,
      height - padding.top - padding.bottom,
    ];

    const xDomain = d3.extent(histogramData
      .reduce((accumular, d) => [...accumular, ...d.bucket], []));
    const xRange = [
      0,
      width - padding.left - padding.right,
    ];

    const xScale = d3.scaleLinear()
      .domain(xDomain)
      .range(xRange);

    const yScale = d3.scaleSqrt()
      .domain(yDomain)
      .range(yRange);
    return {
      xScale,
      yScale,
    };
  },
  drawSVG({
    container,
  }) {
    return container
      .append('svg')
      .attr('class', 'histogram__svg');
  },

  addNationalBarMouseEvents({
    bars,
    updateHighlightedAgencies,
    dataProbe,
    nationalDataView,
  }) {
    bars.on('mouseover', (d) => {
      updateHighlightedAgencies(d.records);


      const { clientX, clientY } = d3.event;
      const pos = {
        left: clientX < window.innerWidth - 260 ? (clientX + 10) : clientX - 260,
        bottom: window.innerHeight - clientY + 10,
        width: 250,
      };
      const entities = nationalDataView === 'ta' ? (`transit authorit${d.records.length > 1 ? 'ies' : 'y'}`)
        : (`MSA${d.records.length > 1 ? 's' : ''}`);
      const html = `
        <div class="data-probe__row"><span class="data-probe__field">${d.records.length} ${entities}</span></div>
        <div class="data-probe__row">${d.bucket.map(val => `${Math.round(val)}%`).join(' to ')}</div>
      `;
      dataProbe
        .config({
          pos,
          html,
        })
        .draw();
    })
      .on('mouseout', () => {
        updateHighlightedAgencies([]);
        dataProbe.remove();
      });
  },
  drawBars({
    svg,
    xScale,
    yScale,
    changeColorScale,
    padding,
    height,
    histogramData,
    barSpacing,
    updateHighlightedAgencies,
    dataProbe,
    nationalDataView,
  }) {
    const {
      addNationalBarMouseEvents,
    } = histogramFunctions;

    const {
      getBarPositions,
    } = localFunctions;

    const positionAttrs = getBarPositions({
      xScale,
      yScale,
      height,
      padding,
      histogramData,
      barSpacing,
    });

    const bars = svg
      .selectAll('.histogram__bar')
      .data(histogramData, d => d.index)
      .enter()
      .append('rect')
      .attrs(Object.assign({
        y: d => (height - padding.bottom) - yScale(d.count),
        height: d => yScale(d.count),
        fill: d => changeColorScale((d.bucket[1] + d.bucket[0]) / 2),
        stroke: '#999999',
        'stroke-width': 1,
      }, positionAttrs));

    addNationalBarMouseEvents({
      bars,
      updateHighlightedAgencies,
      dataProbe,
      nationalDataView,
    });

    return bars;
  },
  drawAxes({
    xScale,
    yScale,
    svg,
    padding,
    height,
  }) {
    console.log('axesss');
    const {
      getYAxisGenerator,
      getXAxisGenerator,
    } = localFunctions;
    const xAxis = svg
      .append('g')
      .attrs({
        transform: `translate(${padding.left}, ${height - padding.bottom})`,
        class: 'histogram__axis',
      })
      .call(getXAxisGenerator({ xScale }));

    const yAxis = svg.append('g')
      .attrs({
        transform: `translate(${padding.left + xScale.range()[1]}, ${padding.top})`,
        class: 'histogram__axis',
      })
      .call(getYAxisGenerator({ xScale, yScale }));
    // console.log('yAxis', yAxis);
    return { xAxis, yAxis };
  },
  drawAverageLine({
    svg,
    nationalAverage,
    xScale,
    padding,
    height,
  }) {
    const {
      getNationalAverageText,
    } = localFunctions;

    const nationalAverageGroup = svg
      .append('g')
      .style('pointer-events', 'none')
      .attr('transform', `translate(${padding.left + xScale(nationalAverage)}, ${padding.top})`);

    const nationalAverageText = nationalAverageGroup
      .append('text')
      .attrs({
        class: 'histogram__average-text',
        'text-anchor': 'middle',
        x: Math.max(0, 70 - xScale(nationalAverage)),
        y: -8,
      });

    nationalAverageText
      .text(getNationalAverageText({ nationalAverage }));

    nationalAverageGroup
      .append('line')
      .attrs({
        class: 'histogram__average-line',
        y1: 0,
        y2: height - padding.bottom - padding.top,
        x1: 0,
        x2: 0,
      });
    return {
      nationalAverageGroup,
      nationalAverageText,
    };
  },


  hideAverageLine({
    nationalAverageGroup,
  }) {
    if (nationalAverageGroup === undefined) return;
    nationalAverageGroup
      .style('opacity', 0);
  },


  addMSABarMouseEvents({
    bars,
    dataProbe,
    updateHighlightedTracts,
  }) {
    bars.on('mouseover', (d) => {
      updateHighlightedTracts(d.records);
      const { clientX, clientY } = d3.event;
      const pos = {
        left: clientX < window.innerWidth - 260 ? (clientX + 10) : clientX - 260,
        bottom: window.innerHeight - clientY + 10,
        width: 250,
      };
      const html = `
        <div class="data-probe__row"><span class="data-probe__field">${d.records.length} census tract${d.records.length !== 1 ? 's' : ''}</span></div>
        <div class="data-probe__row">${d.bucket.map(val => `${Math.round(val)}%`).join(' to ')}</div>
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
        updateHighlightedTracts([]);
      });
  },
  drawAxisLabels({
    container,
    width,
    height,
    padding,
    mobile,
  }) {
    const {
      getXAxisLabelPosition,
    } = localFunctions;

    const chartHeight = height - padding.top - padding.bottom;

    const xAxisLabel = container.append('div')
      .styles(getXAxisLabelPosition({
        height,
        width,
        padding,
        mobile,
      }));


    const yAxisLabel = container.append('div')
      .styles({
        position: 'absolute',
        left: `${mobile ? (padding.left - chartHeight - 50) / 2 - 10 : -25}px`,
        top: `${(padding.top / (mobile ? 1 : 2)) + (chartHeight / 2)}px`,
        width: `${chartHeight + 50}px`,
        'text-align': 'center',
        transform: 'rotate(-90deg)',
        'transform-origin': 'center',
        'font-size': 12,
        'font-weight': 350,
      });


    return {
      xAxisLabel,
      yAxisLabel,
    };
  },
};

export default histogramFunctions;
