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
    expandedSparklines,
  }) {
    return contentContainer.selectAll('.sidebar__sparkline-row')
      .data(indicatorSummaries, d => d.value)
      .enter()
      .append('div')
      .attr('class', 'sidebar__sparkline-row')
      .classed('expanded', expandedSparklines === true);
  },
  drawSparkLineTitles({
    sparkRows,
    updateIndicator,
  }) {
    return sparkRows
      .append('div')
      .attr('class', 'sidebar__sparkline-title')
      .html(d => `${d.verified ? ' <i class="fa fa-badge-check" title="High confidence"></i>' : ' <i class="fa fa-fw"></i>'}${d.text}`)
      .on('click', updateIndicator);
  },
  drawSparkLines({
    sparkRows,
    yearRange,
    years,
    dataProbe,
    updateIndicator,
    currentScale,
    width,
    mobile,
    embedded,
    expandedSparklines,
  }) {
    const sparkLines = [];

    sparkRows
      .append('div')
      .attr('class', 'sidebar__sparkline-container')
      .on('click', (d) => {
        if (mobile || embedded) return;
        updateIndicator(d);
      })
      .each(function drawSparkline(d) {
        const container = d3.select(this);


        const sparkLine = new SparkLine({
          width: width * 0.4,
          container,
          indicatorData: d,
          yearRange,
          years,
          dataProbe,
          embedded,
          currentScale,
          expanded: (expandedSparklines === true),
          color: true,
        });
        sparkLines.push(sparkLine);
      });
    return sparkLines;
  },
  drawSparkLineExpandButtons({
    sparkRows,
    updateExpandedIndicator,
    expandedSparklines,
  }) {
    const buttons = sparkRows
      .append('div')
      .attr('class', 'sidebar__sparkline-expand')
      .on('click', (d) => {
        updateExpandedIndicator(d);
      });

    if (expandedSparklines === true) buttons.style('visibility', 'hidden');

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
    expandedSparklines,
  }) {
    sparkRows.classed('expanded', d => (expandedSparklines === true) || (expandedIndicator === null ? false : expandedIndicator.value === d.value));
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
