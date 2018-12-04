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
      dataProbe,
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
      dataProbe,
    });

    Object.assign(props, {
      svg,
      scales,
      line,
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
      expanded: false,
      selected: false,
    });

    const {
      init,
    } = privateMethods;

    this.config(config);

    init.call(this);

    this.updateSelected();
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  getIndicator() {
    const { indicatorData } = privateProps.get(this);
    return indicatorData;
  }

  updateSelected() {
    const {
      selected,
      line,
    } = privateProps.get(this);

    line.classed('sidebar__sparkline-path--selected', selected);
  }
}

export default SparkLine;
