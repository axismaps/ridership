import histogramFunctions from './histogramFunctions';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      changeColorScale,
      barSpacing,
      width,
      height,
      bucketCount,
      nationalMapData,
      padding,
      container,
    } = props;

    const {
      getHistogramData,
      getScales,
      drawSVG,
      drawBars,
      drawAxes,
      drawAverageLine,
    } = histogramFunctions;

    const {
      histogramData,
      nationalAverage,
    } = getHistogramData({
      nationalMapData,
      bucketCount,
    });
    const { xScale, yScale } = getScales({
      padding,
      histogramData,
      width,
      height,
    });


    const svg = drawSVG({
      container,
      width,
      height,
    });

    const bars = drawBars({
      svg,
      xScale,
      yScale,
      changeColorScale,
      histogramData,
      padding,
      height,
      width,
      barSpacing,
    });

    const { xAxis, yAxis } = drawAxes({
      xScale,
      yScale,
      svg,
      padding,
      height,
    });

    const {
      nationalAverageGroup,
      nationalAverageText,
    } = drawAverageLine({
      svg,
      nationalAverage,
      xScale,
      padding,
      height,
    });

    Object.assign(props, {
      // xScale,
      // yScale,
      // histogramData,
      bars,
      xAxis,
      yAxis,
      svg,
      nationalAverageGroup,
      nationalAverageText,
    });
  },
  setDimensions() {
    const props = privateProps.get(this);
    const {
      container,
    } = props;
    const {
      width,
      height,
    } = container.node()
      .getBoundingClientRect();

    Object.assign(props, { width, height });
  },
};

class Histogram {
  constructor(config) {
    privateProps.set(this, {
      changeColorScale: null,
      width: null,
      height: null,
      container: null,
      bucketCount: 16,
      padding: {
        top: 30,
        bottom: 65,
        left: 85,
        right: 250,
      },
      barSpacing: 5,
    });
    const {
      init,
      setDimensions,
      // drawBars,
    } = privateMethods;

    this.config(config);

    setDimensions.call(this);
    init.call(this);
    // drawBars.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  updateData() {
    const {
      getHistogramData,
      updateBars,
      getScales,
      updateAxes,
      updateAverageLine,
    } = histogramFunctions;

    const {
      bars,
      changeColorScale,
      nationalMapData,
      bucketCount,
      padding,
      width,
      height,
      xAxis,
      nationalAverageGroup,
      nationalAverageText,
      yAxis,
    } = privateProps.get(this);

    const {
      histogramData,
      nationalAverage,
    } = getHistogramData({
      nationalMapData,
      bucketCount,
    });

    const { yScale, xScale } = getScales({
      padding,
      histogramData,
      width,
      height,
    });

    updateAxes({
      xScale,
      yScale,
      xAxis,
      yAxis,
    });

    updateBars({
      height,
      padding,
      bars,
      histogramData,
      yScale,
      changeColorScale,
    });

    updateAverageLine({
      nationalAverageGroup,
      nationalAverage,
      nationalAverageText,
      xScale,
      padding,
    });
  }
}

export default Histogram;
