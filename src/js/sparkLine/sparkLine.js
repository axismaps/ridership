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
      drawAxis,
      updateInteractions,
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

    const axis = drawAxis({
      svg,
      scales,
    });

    const line = drawLine({
      indicatorData,
      svg,
      scales,
    });

    updateInteractions({
      indicatorData,
      svg,
      scales,
      dataProbe,
    });

    Object.assign(props, {
      svg,
      scales,
      line,
      axis,
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

  updateExpanded() {
    const {
      expanded,
      height,
    } = privateProps.get(this);

    if (expanded === true) {
      this.config({
        height: 160,
      }).updateSize();
    } else if (height !== 30) {
      this.config({
        height: 30,
      }).updateSize();
    }

    return this;
  }

  updateSize() {
    const {
      getScales,
      updateSparkline,
      updateInteractions,
    } = sparkLineFunctions;

    const props = privateProps.get(this);

    const {
      indicatorData,
      yearRange,
      width,
      height,
      svg,
      expanded,
      line,
      dataProbe,
    } = props;

    const scales = getScales({
      indicatorData,
      width,
      height,
      yearRange,
    });

    Object.assign(props, {
      scales,
    });

    updateSparkline({
      expanded,
      svg,
      line,
      scales,
      width,
      height,
    });

    updateInteractions({
      indicatorData,
      svg,
      scales,
      dataProbe,
    });

    return this;
  }
}

export default SparkLine;
