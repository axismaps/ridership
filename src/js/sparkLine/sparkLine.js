import sparkLineFunctions from './sparkLineFunctions';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      container,
      indicatorData,
      width,
      height,
      yearRange,
    } = props;

    const {
      drawSVG,
      drawLine,
      getScales,
    } = sparkLineFunctions;
    const svg = drawSVG({
      container,
      width,
      height,
    });

    const scales = getScales({
      indicatorData,
      width,
      height,
      yearRange,
    });

    const line = drawLine({
      scales,
      svg,
      width,
      height,
      indicatorData,
    });
  },
};

class SparkLine {
  constructor(config) {
    privateProps.set(this, {
      height: 30,
      width: 180,
      indicatorData: null,
      yearRange: null,
    });

    const {
      init,
    } = privateMethods;

    this.config(config);

    init.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
}

export default SparkLine;
