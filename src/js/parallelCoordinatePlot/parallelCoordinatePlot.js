import pcpFunctions from './parallelCoordinatePlotFunctions';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      pcpContainer,
      agenciesData,
      indicatorSummaries,
      indicatorHeight,
      width,
      margins,
      dataProbe,
      updateIndicator,
      updateHighlightedAgencies,
      maxValue,
      color,
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
      agenciesData,
      width,
      margins,
      maxValue,
    });

    const lines = drawLines({
      agenciesData,
      indicatorHeight,
      width,
      svg,
      xScale,
      dataProbe,
      updateHighlightedAgencies,
      color,
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
      agenciesData: null,
      yearRange: null,
      margins: [30, 15],
      currentIndicator: null,
      maxValue: 200,
      highlightedAgencies: [],
      color: () => 'rgb(0,0,0)',
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
      agenciesData,
      indicatorHeight,
      width,
      margins,
      svg,
      dataProbe,
      maxValue,
      color,
    } = privateProps.get(this);

    const xScale = getXScale({
      agenciesData,
      width,
      margins,
      maxValue,
    });

    drawLines({
      agenciesData,
      indicatorHeight,
      width,
      svg,
      xScale,
      dataProbe,
      color,
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

    return this;
  }

  updateHighlight() {
    const {
      lines,
      highlightedAgencies,
    } = privateProps.get(this);

    lines.classed('highlight', (d) => {
      const highlightIds = highlightedAgencies.map(agency => agency.taId);
      return highlightIds.includes(d.taId);
    });

    return this;
  }
}

export default ParallelCoordinatePlot;
