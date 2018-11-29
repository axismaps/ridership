import histogramFunctions from './histogramFunctions';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      // changeColorScale,
      width,
      height,
      bucketCount,
      nationalMapData,
    } = props;

    const {
      getHistogramData,
      getScales,
    } = histogramFunctions;

    const histogramData = getHistogramData({
      nationalMapData,
      bucketCount,
    });
    const scales = getScales({
      histogramData,
      width,
      height,
    });
    console.log('histogram data', histogramData);
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
    });
    const {
      init,
      setDimensions,
    } = privateMethods;

    this.config(config);

    setDimensions.call(this);
    init.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
}

export default Histogram;
