const sidebarPureFunctions = {
  drawSparklineRows({
    contentContainer,
    indicatorSummaries,
  }) {
    const sparkRows = contentContainer.selectAll('.sidebar__sparkline-row')
      .data(indicatorSummaries, d => d.value)
      .enter()
      .append('div')
      .attr('class', 'sidebar__sparkline-row');

    sparkRows
      .append('div')
      .attr('class', 'sidebar__sparkline-title')
      .text(d => d.text);
  },
};

export default sidebarPureFunctions;
