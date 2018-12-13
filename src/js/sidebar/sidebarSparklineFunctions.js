import SparkLine from '../sparkLine/sparkLine';

const sidebarPureFunctions = {
  drawMSASparklineLegend({
    contentContainer,
    indicatorSummaries,
    taFilter,
  }) {
    const { agencies } = indicatorSummaries
      .find(d => d.value === 'upt');
    console.log('agencies', agencies);
    const legendContainer = contentContainer
      .append('div')
      .attr('class', 'sidebar__sparkline-legend-container')
      .text('');

    const rows = legendContainer
      .selectAll('.sidebar__sparkline-legend-row')
      .data(agencies)
      .enter()
      .append('div')
      .attr('class', 'sidebar__sparkline-legend-row');
      // .text(d => d.taName);

    const rowsLeft = rows.append('div')
      .attr('class', 'sidebar__sparkline-legend-row-left');

    const rowsRight = rows.append('div')
      .attr('class', 'sidebar__sparkline-legend-row-right');

    rowsLeft.append('div')
      .attr('class', 'sidebar__sparkline-legend-check')
      .html((d) => {
        if (taFilter.has(d.taId)) {
          return '<i class="fas fa-square"></i>';
        }
        return '<i class="fas fa-check-square"></i>';
      });

    rowsLeft.append('div')
      .attr('class', 'sidebar__sparkline-legend-text')
      .text(d => d.taName);
    const swatchWidth = 12;
    const swatchHeight = 12;
    rowsRight.append('div')
      .attr('class', 'sidebar__sparkline-legend-swatch-container')
      .append('svg')
      .styles({
        width: `${swatchWidth}px`,
        height: `${swatchHeight}px`,
      })
      .append('rect')
      .attrs({
        width: swatchWidth,
        height: swatchHeight,
        x: 0,
        y: 0,
        fill: d => d.color,
      });
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

export default sidebarPureFunctions;
