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
  }) {
    return new ParallelCoordinatePlot({
      pcpContainer,
      allAgenciesData,
      indicatorSummaries,
    });
  },
};

export default sidebarPureFunctions;
