import SparkLine from '../sparkLine/sparkLine';

const sidebarPureFunctions = {
  drawSparkLineRows({
    contentContainer,
    indicatorSummaries,
  }) {
    return contentContainer.selectAll('.sidebar__sparkline-row')
      .data(indicatorSummaries, d => d.value)
      .enter()
      .append('div')
      .attr('class', 'sidebar__sparkline-row');
  },
  drawSparkLineTitles({
    sparkRows,
  }) {
    return sparkRows
      .append('div')
      .attr('class', 'sidebar__sparkline-title')
      .text(d => d.text);
  },
  drawSparkLines({
    sparkRows,
  }) {
    const width = 180;
    const height = 30;
    sparkRows
      .append('div')
      .attr('class', 'sidebar__sparkline-container')
      .append('svg')
      .attr('class', 'sidebar__sparkline-svg')
      .styles({
        width: `${width}px`,
        height: `${height}px`,
      })
      .each(function drawSparkline() {
        const svg = d3.select(this);
      });
  },
  updateCurrentSparklineIndicator() {

  },
  updateExpandedSparkline() {

  },
};

export default sidebarPureFunctions;
