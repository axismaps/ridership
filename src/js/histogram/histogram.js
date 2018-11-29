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
    } = histogramFunctions;

    const histogramData = getHistogramData({
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

    Object.assign(props, {
      // xScale,
      // yScale,
      // histogramData,
      bars,
      svg,
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
  // drawBars() {
  //   const props = privateProps.get(this);
  //   const {
  //     svg,
  //     xScale,
  //     yScale,
  //     changeColorScale,
  //     histogramData,
  //     padding,
  //     height,
  //     width,
  //     barSpacing,
  //   } = props;
  //   const {
  //     drawBars,
  //   } = histogramFunctions;
  //   const bars = drawBars({
  //     svg,
  //     xScale,
  //     yScale,
  //     changeColorScale,
  //     histogramData,
  //     padding,
  //     height,
  //     width,
  //     barSpacing,
  //   });
  //   Object.assign(props, { bars });
  // },
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
        top: 0,
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
    } = histogramFunctions;
    const {
      bars,
      // yScale,
      changeColorScale,
      nationalMapData,
      bucketCount,
      padding,
      width,
      height,
    } = privateProps.get(this);
    const histogramData = getHistogramData({
      nationalMapData,
      bucketCount,
    });
    const { yScale } = getScales({
      padding,
      histogramData,
      width,
      height,
    });
    updateBars({
      height,
      padding,
      bars,
      histogramData,
      yScale,
      changeColorScale,
    });
  }
}

export default Histogram;
