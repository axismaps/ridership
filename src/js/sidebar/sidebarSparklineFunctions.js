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
    yearRange,
  }) {
    const sparkLines = [];

    sparkRows
      .append('div')
      .attr('class', 'sidebar__sparkline-container')
      .each(function drawSparkline(d) {
        const container = d3.select(this);

        const sparkLine = new SparkLine({
          container,
          indicatorData: d,
          yearRange,
        });
        sparkLines.push(sparkLine);
      });
    return sparkLines;
  },
  updateCurrentSparklineIndicator() {

  },
  updateExpandedSparkline() {

  },
};

export default sidebarPureFunctions;
