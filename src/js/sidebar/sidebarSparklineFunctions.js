import SparkLine from '../sparkLine/sparkLine';

const sidebarSparkLineFunctions = {
  toggleSparkLineAxis({
    sparkLineAxisContainer,
    sparkLineView,
  }) {
    sparkLineAxisContainer
      .classed('sidebar__sparkline-axis--hidden', !sparkLineView);
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
    dataProbe,
    updateIndicator,
    currentScale,
    width,
    mobile,
  }) {
    const sparkLines = [];

    sparkRows
      .append('div')
      .attr('class', 'sidebar__sparkline-container')
      .on('click', (d) => {
        if (mobile !== true) updateIndicator(d);
      })
      .each(function drawSparkline(d) {
        const container = d3.select(this);

        const sparkLine = new SparkLine({
          width: width * 0.4,
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
  drawSparkLineExpandButtons({
    sparkRows,
    updateExpandedIndicator,
  }) {
    const buttons = sparkRows
      .append('div')
      .attr('class', 'sidebar__sparkline-expand')
      .on('click', (d) => {
        updateExpandedIndicator(d);
      });

    buttons.append('i')
      .attr('class', 'fas fa-chevron-down');

    return buttons;
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

export default sidebarSparkLineFunctions;
