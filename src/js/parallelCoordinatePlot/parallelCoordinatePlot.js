import pcpFunctions from './parallelCoordinatePlotFunctions';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      pcpContainer,
      allAgenciesData,
      indicatorSummaries,
      indicatorHeight,
      width,
      margins,
      dataProbe,
    } = props;

    const {
      drawIndicators,
      drawSVG,
      drawLines,
      getXScale,
      drawAxis,
    } = pcpFunctions;

    const labels = drawIndicators({
      pcpContainer,
      indicatorSummaries,
      indicatorHeight,
    });

    const svg = drawSVG({
      pcpContainer,
      indicatorSummaries,
      indicatorHeight,
      width,
      margins,
    });

    const xScale = getXScale({
      allAgenciesData,
      width,
      margins,
    });

    const lines = drawLines({
      allAgenciesData,
      indicatorHeight,
      width,
      svg,
      xScale,
      dataProbe,
    });

    const axis = drawAxis({
      svg,
      xScale,
    });

    Object.assign(props, {
      drawLines,
      drawAxis,
      labels,
      svg,
      getXScale,
      lines,
      axis,
    });
  },
};

class ParallelCoordinatePlot {
  constructor(config) {
    privateProps.set(this, {
      indicatorHeight: 40,
      width: 180,
      allAgenciesData: null,
      yearRange: null,
      expanded: false,
      selected: false,
      margins: [30, 15],
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

  updateData() {
    const {
      drawLines,
      drawAxis,
      getXScale,
      allAgenciesData,
      indicatorHeight,
      width,
      margins,
      svg,
      dataProbe,
    } = privateProps.get(this);

    const xScale = getXScale({
      allAgenciesData,
      width,
      margins,
    });

    drawLines({
      allAgenciesData,
      indicatorHeight,
      width,
      svg,
      xScale,
      dataProbe,
    });

    drawAxis({
      svg,
      xScale,
    });

    Object.assign(privateProps.get(this), {
      xScale,
    });

    return this;
  }
}

export default ParallelCoordinatePlot;
