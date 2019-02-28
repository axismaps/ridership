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
    mobile,
  }) {
    const {
      getBucketText,
    } = localFunctions;

    const drawProbe = (d) => {
      dataProbe.remove();
      if (!mobile) updateHighlightedAgencies(d.records);

      const { clientX, clientY } = d3.event;
      const pos = {
        left: clientX < window.innerWidth - 260 ? (clientX + 10) : clientX - 260,
        bottom: window.innerHeight - clientY + 10,
        width: 250,
      };
      const entities = nationalDataView === 'ta' ? (`transit authorit${d.records.length > 1 ? 'ies' : 'y'}`)
        : (`MSA${d.records.length > 1 ? 's' : ''}`);

      const { bucket } = d;
      const html = `
        <div class="data-probe__row"><span class="data-probe__field">${d.records.length} ${entities}</span></div>
        <div class="data-probe__row">${getBucketText({ bucket })}</div>
      `;
      dataProbe
        .config({
          pos,
          html,
        })
        .draw();
    };

    bars.on('mouseover', (d) => {
      if (mobile) return;
      drawProbe(d);
    })
      .on('mouseout', () => {
        // if (mobile) return;
        updateHighlightedAgencies([]);
        dataProbe.remove();
      })
      .on('click', (d) => {
        if (!mobile) return;
        drawProbe(d);
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

  }) {
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

    const barsSelection = svg
      .selectAll('.histogram__bar')
      .data(histogramData, d => d.index);

    const barsEnter = barsSelection
      .enter()
      .append('rect')
      .attrs(Object.assign({
        class: 'histogram__bar',
      }, positionAttrs, {
        height: 0,
        y: height - padding.bottom,
      }));

    barsSelection
      .exit()
      .transition()
      .duration(500)
      .attrs({
        height: 0,
        y: height - padding.bottom,
      })
      .remove();

    const bars = barsEnter
      .merge(barsSelection);
    bars
      .transition()
      .duration(500)
      .attrs(Object.assign({
        height: d => yScale(d.count),
        y: d => (height - padding.bottom) - yScale(d.count),
        fill: d => changeColorScale((d.bucket[1] + d.bucket[0]) / 2),
        stroke: '#999999',
        'stroke-width': 1,
      }, positionAttrs));
    return bars;
  },
  drawAxes({
    xScale,
    yScale,
    svg,
    padding,
    height,
  }) {
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
    mobile,
  }) {
    const { getBucketText } = localFunctions;
    console.log('mobile', mobile);
    bars.on('mouseover', (d) => {
      if (mobile) return;
      updateHighlightedTracts(d.records);

      const { clientX, clientY } = d3.event;
      const pos = {
        left: clientX < window.innerWidth - 260 ? (clientX + 10) : clientX - 260,
        bottom: window.innerHeight - clientY + 10,
        width: 250,
      };
      const { bucket } = d;
      const html = `
        <div class="data-probe__row"><span class="data-probe__field">${d.records.length} census tract${d.records.length !== 1 ? 's' : ''}</span></div>
        <div class="data-probe__row">${getBucketText({ bucket })}</div>
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

    // const chartHeight = height - padding.top - padding.bottom;

    const xAxisLabel = container.append('div')
      .attr('class', 'histogram__x-axis-label')
      .styles(getXAxisLabelPosition({
        height,
        width,
        padding,
        mobile,
      }));


    const yAxisLabel = container.append('div')
      .attr('class', 'histogram__y-axis-label')
      .append('div')

      .styles({
        position: 'relative',
        // position: 'absolute',
        // left: `${mobile ? (padding.left - chartHeight - 50) / 2 - 10 : -25}px`,
        // top: `${(padding.top / (mobile ? 1 : 2)) + (chartHeight / 2)}px`,
        // width: `${chartHeight + 50}px`,
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
