const localFunctions = {
  getXAxisGenerator({ xScale }) {
    return d3.axisBottom(xScale);
  },
  getYAxisGenerator({
    xScale,
    yScale,
  }) {
    const yScaleReversed = d3.scaleLinear()
      .domain(yScale.domain())
      .range([yScale.range()[1], yScale.range()[0]]);
    return d3.axisLeft(yScaleReversed)
      .tickSize(xScale.range()[1])
      .ticks(4);
  },
  getNationalAverageText({
    // nationalAverageText,
    nationalAverage,
  }) {
    const formatPercent = d3.format('.1%');
    return `National Change: ${formatPercent(nationalAverage / 100)}`;
    // nationalAverageText
    //   .text(`National Change: ${formatPercent(nationalAverage / 100)}`);
  },
  getBarPositions({
    xScale,
    yScale,
    height,
    padding,
    histogramData,
    barSpacing,
  }) {
    const count = histogramData.length;

    const rectWidth = ((xScale.range()[1] - xScale.range()[0]) / count) - barSpacing;
    return {
      x: (d, i) => padding.left + ((rectWidth + barSpacing) * i),
      width: rectWidth,
      y: d => (height - padding.bottom) - yScale(d.count),
      height: d => yScale(d.count),
    };
  },
  getAverageLinePosition({
    padding,
    xScale,
    nationalAverage,
  }) {
    return {
      transform: `translate(${padding.left + xScale(nationalAverage)}, ${padding.top})`,
    };
  },
  getXAxisLabelPosition({
    width,
    height,
    padding,
    mobile,
  }) {
    const chartWidth = width - padding.left - padding.right;
    return {
      position: 'absolute',
      left: `${padding.left}px`,
      top: `${!mobile ? height - (padding.bottom / 2) : height - padding.bottom + 30}px`,
      width: `${chartWidth}px`,
      'text-align': 'center',
      'font-size': 12,
      'font-weight': 350,
    };
  },
  getBucketText({ bucket }) {
    let bucketText;
    if (bucket[0] < -300) {
      bucketText = '< -295%';
    } else if (bucket[1] > 300) {
      bucketText = '> 295%';
    } else {
      bucketText = bucket.map(val => `${Math.round(val)}%`).join(' to ');
    }
    return bucketText;
  },
};

export default localFunctions;
