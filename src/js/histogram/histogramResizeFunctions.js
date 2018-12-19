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
    }));
  },
  resizeAverageLine({
    padding,
    xScale,
    nationalAverage,
    nationalAverageGroup,
  }) {
    const {
      getAverageLinePosition,
    } = localFunctions;
    nationalAverageGroup
      .attrs(getAverageLinePosition({
        padding,
        xScale,
        nationalAverage,
      }));
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
};

export default resizeFunctions;
