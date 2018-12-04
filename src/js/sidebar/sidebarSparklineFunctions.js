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
    updateIndicator,
  }) {
    return sparkRows
      .append('div')
      .attr('class', 'sidebar__sparkline-title')
      .text(d => d.text)
      .on('click', updateIndicator);
  },
  drawSparkLines({
    sparkRows,
    yearRange,
    updateCurrentIndicator,
  }) {
    const sparkLines = [];

    sparkRows
      .append('div')
      .attr('class', 'sidebar__sparkline-container')
      .on('click', (d) => {
        updateCurrentIndicator(d);
      })
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
