import SparkLine from '../sparkLine/sparkLine';

const sidebarPureFunctions = {
  drawMSASparklineLegend({
    contentContainer,
  }) {
    const legendContainer = contentContainer
      .append('div')
      .attr('class', 'sidebar__sparkline-legend-container')
      .text('LEGEND');
  },
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
    updateExpandedIndicator,
  }) {
    return sparkRows
      .append('div')
      .attr('class', 'sidebar__sparkline-title')
      .text(d => d.text)
      .on('click', (d) => {
        updateExpandedIndicator(d);
      });
  },
  drawSparkLines({
    sparkRows,
    yearRange,
    dataProbe,
    updateIndicator,
    currentScale,
  }) {
    const sparkLines = [];

    sparkRows
      .append('div')
      .attr('class', 'sidebar__sparkline-container')
      .on('click', updateIndicator)
      .each(function drawSparkline(d) {
        const container = d3.select(this);

        const sparkLine = new SparkLine({
          container,
          indicatorData: d,
          yearRange,
          dataProbe,
          color: currentScale === 'msa',
        });
        sparkLines.push(sparkLine);
      });
    return sparkLines;
  },
  updateCurrentSparklineIndicator() {

  },
  updateExpandedSparkline({
    sparkRows,
    sparkLines,
    expandedIndicator,
  }) {
    sparkRows.classed('expanded', d => (expandedIndicator === null ? false : expandedIndicator.value === d.value));
    sparkLines.forEach((sparkline) => {
      const indicator = sparkline.getIndicator();
      const expanded = expandedIndicator === null ? false
        : expandedIndicator.value === indicator.value;
      sparkline
        .config({ expanded })
        .updateExpanded();
    });
    return sparkLines;
  },
};

export default sidebarPureFunctions;
