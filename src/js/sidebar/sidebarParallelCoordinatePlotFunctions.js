import ParallelCoordinatePlot from '../parallelCoordinatePlot/parallelCoordinatePlot';

const sidebarPureFunctions = {
  drawPcpContainer({
    contentContainer,
    years,
  }) {
    const container = contentContainer.append('div')
      .attr('class', 'sidebar__pcp-container');

    container.append('p')
      .attr('class', 'mobile sidebar__pcp-title')
      .html('Parallel Cooordinate Plot');

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
    mobile,
  }) {
    return new ParallelCoordinatePlot({
      mobile,
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
