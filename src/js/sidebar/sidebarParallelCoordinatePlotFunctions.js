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
  }) {
    return new ParallelCoordinatePlot({
      pcpContainer,
      allAgenciesData,
      indicatorSummaries,
      dataProbe,
      updateIndicator,
    });
  },
};

export default sidebarPureFunctions;
