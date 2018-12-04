import ParallelCoordinatePlot from '../parallelCoordinatePlot/parallelCoordinatePlot';

const sidebarPureFunctions = {
  drawPcpContainer({
    contentContainer,
  }) {
    return contentContainer.append('div')
      .attr('class', 'sidebar__pcp-container');
  },

  drawPcp({
    pcpContainer,
    allAgenciesData,
    indicatorSummaries,
    dataProbe,
    updateIndicator,
    updateHighlightedAgencies,
  }) {
    return new ParallelCoordinatePlot({
      pcpContainer,
      allAgenciesData,
      indicatorSummaries,
      dataProbe,
      updateIndicator,
      updateHighlightedAgencies,
    });
  },
};

export default sidebarPureFunctions;
