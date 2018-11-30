const axisFunctions = {
  getXAxisGenerator({ xScale }) {
    return d3.axisBottom(xScale);
  },
  getYAxisGenerator({ yScale }) {
    const yScaleReversed = d3.scaleLinear()
      .domain(yScale.domain())
      .range([yScale.range()[1], yScale.range()[0]]);
    return d3.axisLeft(yScaleReversed)
      .ticks(4);
  },
};

const histogramFunctions = {
  getHistogramData({
    nationalMapData,
    bucketCount,
  }) {
    console.log('national map data', nationalMapData);

    const allAgencies = nationalMapData
      .reduce((accumulator, msa) => [...accumulator, ...msa.ta], [])
      .filter(d => d.pctChange < 500);

    const nationalAverage = d3.mean(allAgencies, d => d.pctChange);

    const changeSpan = d3.extent(allAgencies, d => d.pctChange);

    const bucketSize = (changeSpan[1] - changeSpan[0]) / bucketCount;

    const histogramData = new Array(bucketCount)
      .fill(null)
      .map((d, i) => {
        const bucket = [
          changeSpan[0] + (i * bucketSize),
          changeSpan[0] + (i * bucketSize) + bucketSize,
        ];
        const agencies = allAgencies
          .filter((agency) => {
            if (i === 0) {
              return agency.pctChange >= bucket[0]
                && agency.pctChange <= bucket[1];
            }
            return agency.pctChange > bucket[0]
              && agency.pctChange <= bucket[1];
          });
        // const bucket = {};
        // bucket.index = i;
        return {
          bucket,
          agencies,
          count: agencies.length,
          index: i,
        };
      });
    return { histogramData, nationalAverage };
  },
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
    const yScale = d3.scaleLinear()
      .domain(yDomain)
      .range(yRange);
    return {
      xScale,
      yScale,
    };
  },
  drawSVG({
    container,
    width,
    height,
  }) {
    return container
      .append('svg')
      .attr('class', 'histogram__svg')
      .styles({
        width: `${width}px`,
        height: `${height}px`,
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
    const count = histogramData.length;

    const rectWidth = ((xScale.range()[1] - xScale.range()[0]) / count) - barSpacing;

    return svg
      .selectAll('.histogram__bar')
      .data(histogramData, d => d.index)
      .enter()
      .append('rect')
      .attrs({
        y: d => (height - padding.bottom) - yScale(d.count),
        x: (d, i) => padding.left + ((rectWidth + barSpacing) * i),
        width: rectWidth,
        height: d => yScale(d.count),
        fill: d => changeColorScale((d.bucket[1] + d.bucket[0]) / 2),
        stroke: '#999999',
        'stroke-width': 1,
      })
      .on('mouseover', (d) => {
        console.log(d);
      });
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
    } = axisFunctions;
    const xAxis = svg
      .append('g')
      .attrs({
        transform: `translate(${padding.left}, ${height - padding.bottom})`,
        class: 'histogram__axis',
      })
      .call(getXAxisGenerator({ xScale }));

    const yAxis = svg.append('g')
      .attrs({
        transform: `translate(${padding.left}, ${padding.top})`,
        class: 'histogram__axis',
      })
      .call(getYAxisGenerator({ yScale }));
    return { xAxis, yAxis };
  },
  drawAverageLine({
    svg,
    nationalAverage,
    xScale,
    padding,
    height,
  }) {
    return svg
      .append('line')
      .attrs({
        class: 'histogram__average-line',
        y1: padding.top,
        y2: height - padding.bottom,
        x1: padding.left + xScale(nationalAverage),
        x2: padding.left + xScale(nationalAverage),
      });
  },
  updateAverageLine({
    averageLine,
    nationalAverage,
    xScale,
    padding,
  }) {
    averageLine
      .transition()
      .duration(500)
      .attrs({
        x1: padding.left + xScale(nationalAverage),
        x2: padding.left + xScale(nationalAverage),
      });
  },
  updateAxes({
    xScale,
    yScale,
    xAxis,
    yAxis,
  }) {
    const {
      getYAxisGenerator,
      getXAxisGenerator,
    } = axisFunctions;

    yAxis.transition()
      .duration(500)
      .call(getYAxisGenerator({ yScale }));

    xAxis.transition()
      .duration(500)
      .call(getXAxisGenerator({ xScale }));
  },
  updateBars({
    bars,
    histogramData,
    yScale,
    changeColorScale,
    height,
    padding,
  }) {
    bars
      .data(histogramData, d => d.index)
      .transition()
      .duration(500)
      .attrs({
        height: d => yScale(d.count),
        y: d => (height - padding.bottom) - yScale(d.count),
        fill: d => changeColorScale((d.bucket[1] + d.bucket[0]) / 2),
        stroke: '#999999',
        'stroke-width': 1,
      });
  },
};

export default histogramFunctions;
