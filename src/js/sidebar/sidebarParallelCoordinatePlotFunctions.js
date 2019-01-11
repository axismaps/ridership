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
    currentScale,
    updateMSA,
  }) {
    return new ParallelCoordinatePlot({
      pcpContainer,
      updateMSA,
      agenciesData,
      indicatorSummaries,
      dataProbe,
      updateIndicator,
      msaScale: currentScale === 'msa',
      updateHighlightedAgencies,
    });
  },
};

export default sidebarPureFunctions;
