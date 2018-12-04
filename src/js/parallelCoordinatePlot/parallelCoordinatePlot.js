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
      updateIndicator,
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
      margins,
      updateIndicator,
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
      indicatorHeight: 60,
      width: 220,
      allAgenciesData: null,
      yearRange: null,
      expanded: false,
      selected: false,
      margins: [30, 15],
      currentIndicator: null,
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

  updateSelected() {
    const {
      pcpContainer,
      currentIndicator,
    } = privateProps.get(this);
    pcpContainer.selectAll('.sidebar__pcp-row').classed('sidebar__pcp-row--selected', d => currentIndicator.value === d.value);
    pcpContainer.selectAll('.pcp-ticks path').classed('pcp-tick--selected', d => currentIndicator.value === d.value);
  }
}

export default ParallelCoordinatePlot;
