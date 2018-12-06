import ParallelCoordinatePlot from '../parallelCoordinatePlot/parallelCoordinatePlot';

const sidebarPureFunctions = {
  drawPcpContainer({
    contentContainer,
    years,
  }) {
    const container = contentContainer.append('div')
      .attr('class', 'sidebar__pcp-container');

    container.append('div')
      .attr('class', 'sidebar__pcp-header')
      .append('p')
      .html(`% change, <span class="sidebar__pcp-years">${years.join(' – ')}<span>`);

    return container;
  },

  drawPcp({
    pcpContainer,
    agenciesData,
    indicatorSummaries,
    dataProbe,
    updateIndicator,
    updateHighlightedAgencies,
  }) {
    return new ParallelCoordinatePlot({
      pcpContainer,
      agenciesData,
      indicatorSummaries,
      dataProbe,
      updateIndicator,
      updateHighlightedAgencies,
    });
  },
};

export default sidebarPureFunctions;
