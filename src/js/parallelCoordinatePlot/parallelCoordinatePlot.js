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
      msaScale,
      updateMSA,
      mobile,
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
      msaScale,
      updateMSA,
      mobile,
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
      msaScale: null,
      maxValue: 100,
      highlightedAgencies: [],
      searchResult: null,
      color: d => (d.compareColor || 'rgb(0,0,0)'),
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
      updateHighlightedAgencies,
      msaScale,
      updateMSA,
      mobile,
    } = privateProps.get(this);

    const xScale = getXScale({
      agenciesData,
      width,
      margins,
      maxValue,
    });

    const lines = drawLines({
      updateMSA,
      agenciesData,
      indicatorHeight,
      width,
      svg,
      xScale,
      dataProbe,
      color,
      updateHighlightedAgencies,
      msaScale,
      mobile,
    });

    drawAxis({
      svg,
      xScale,
    });

    Object.assign(privateProps.get(this), {
      xScale,
      lines,
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
      const highlightIds = highlightedAgencies.map(agency => agency.globalId);
      return highlightIds.includes(d.globalId);
    });

    return this;
  }

  updateSearchResult() {
    const {
      lines,
      searchResult,
    } = privateProps.get(this);

    lines.classed('search-result', d => searchResult !== null && searchResult.globalId === d.globalId);

    return this;
  }
}

export default ParallelCoordinatePlot;
