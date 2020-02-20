import localFunctions from './histogramLocalFunctions';

const resizeFunctions = {
  setSVGSize({
    svg,
    width,
    height,
  }) {
    svg.styles({
      width: `${width}px`,
      height: `${height}px`,
    });
  },
  resizeBars({
    bars,
    xScale,
    yScale,
    height,
    padding,
    histogramData,
    barSpacing,
  }) {
    const {
      getBarPositions,
    } = localFunctions;
    bars.attrs(getBarPositions({
      xScale,
      padding,
      histogramData,
      barSpacing,
      yScale,
      height,
    }));
  },
  resizeAverageLine({
    padding,
    xScale,
    height,
    nationalAverage,
    nationalAverageGroup,
  }) {
    const {
      getAverageLinePosition,
    } = localFunctions;
    if (nationalAverageGroup === undefined) return;
    nationalAverageGroup
      .attrs(getAverageLinePosition({
        padding,
        xScale,
        nationalAverage,
      }));
    let anchor = 'middle';
    if (xScale(nationalAverage) < (3 * xScale.range()[0] + xScale.range()[1]) / 4) {
      anchor = 'start';
    } else if (xScale(nationalAverage) > (3 * xScale.range()[1] + xScale.range()[0]) / 4) {
      anchor = 'end';
    }
    nationalAverageGroup
      .select('text')
      .attr('x', '0')
      .attr('text-anchor', anchor);
    nationalAverageGroup.select('line')
      .attr('y2', height - padding.bottom - padding.top);
  },
  resizeXAxisLabel({
    xAxisLabel,
    width,
    padding,
    height,
  }) {
    const {
      getXAxisLabelPosition,
    } = localFunctions;
    xAxisLabel.styles(getXAxisLabelPosition({
      height,
      width,
      padding,
    }));
  },

  resizeYAxisLabel({
    yAxisLabel,
    // height,
    // padding,
    // mobile,
  }) {
    // const chartHeight = height - padding.top - padding.bottom;
    yAxisLabel.styles({
      // left: `${mobile ? (padding.left - chartHeight - 50) / 2 - 10 : -25}px`,
      // top: `${(padding.top / (mobile ? 1 : 2)) + (chartHeight / 2)}px`,
      // width: `${chartHeight + 50}px`,
    });
  },
};

export default resizeFunctions;
