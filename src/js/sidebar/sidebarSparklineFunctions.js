import SparkLine from '../sparkLine/sparkLine';

const sidebarPureFunctions = {
  drawSparkLineRows({
    contentContainer,
    indicatorSummaries,
    updateIndicator,
  }) {
    return contentContainer.selectAll('.sidebar__sparkline-row')
      .data(indicatorSummaries, d => d.value)
      .enter()
      .append('div')
      .attr('class', 'sidebar__sparkline-row')
      .on('click', updateIndicator);
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
          // selected: currentIndicator.value === d.value,
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
