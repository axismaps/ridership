const sidebarLegendFunctions = {
  drawMSASparkLineLegend({
    // contentContainer,
    taFilter,
    updateTAFilter,
    saveTAChecks,
    currentAgencies,
    legendContainer,
    getOpenDropdowns,
    setOpenDropdowns,
  }) {
    const {
      setSparkLineLegendChecks,
    } = sidebarLegendFunctions;

    const showAllContainer = legendContainer.append('div')
      .attr('class', 'sidebar__sparkline-legend-show-all');

    const showAllButton = showAllContainer.append('button')
      .attr('class', 'sidebar__sparkline-legend-show-all-button')
      .html(taFilter.size ? 'Show all agencies' : 'Hide all agencies')
      .on('click', () => {
        if (taFilter.size) {
          updateTAFilter(null);
          showAllButton.html('Hide all agencies');
        } else {
          updateTAFilter(currentAgencies.map(d => d.taId));
          showAllButton.html('Show all agencies');
        }
      });

    const rowContainers = legendContainer
      .selectAll('.sidebar__sparkline-legend-row-outer')
      .data(currentAgencies)
      .enter()
      .append('div')
      .attr('class', 'sidebar__sparkline-legend-row-outer');

    const rows = rowContainers
      .append('div')
      .attr('class', 'sidebar__sparkline-legend-row');
      // .text(d => d.taName);

    const rowsLeft = rows.append('div')
      .attr('class', 'sidebar__sparkline-legend-row-left');

    const rowsRight = rows.append('div')
      .attr('class', 'sidebar__sparkline-legend-row-right');

    const dropdownButtonContainers = rowsLeft.append('div')
      .attr('class', 'sidebar__sparkline-legend-dropdown-container')
      .append('div');

    const subAgencyContainers = rowContainers
      .append('div')
      .attr('class', 'sidebar__sparkline-legend-sub-agencies')
      .classed('sidebar__sparkline-legend-sub-agencies--hidden', true);
    subAgencyContainers
      .each(function drawSubAgencies(d) {
        d3.select(this)
          .selectAll('.sidebar__sparkline-legend-sub-agency')
          .data(d.subTa)
          .enter()
          .append('div')
          .attr('class', 'sidebar__sparkline-legend-sub-agency')
          .text(dd => dd.taName);
      });
    dropdownButtonContainers
      .append('div')
      .attr('class', 'sidebar__sparkline-legend-dropdown-button')
      .classed('sidebar__sparkline-legend-dropdown--hidden', d => d.subTa.length === 0)
      .classed('sidebar__sparkline-legend-dropdown--open', false)
      .html(`
        <i class="fas fa-caret-right"></i>
        <i class="fas fa-caret-down"></i>
      `)
      .on('click', function setButtonStatus(d) {
        const opened = getOpenDropdowns();

        if (opened.includes(d.taId)) {
          setOpenDropdowns(opened.filter(dd => dd !== d.taId));
        } else {
          setOpenDropdowns([...opened, d.taId]);
        }
        const newOpened = getOpenDropdowns();

        d3.select(this)
          .classed('sidebar__sparkline-legend-dropdown--open', newOpened.includes(d.taId));

        subAgencyContainers
          .classed('sidebar__sparkline-legend-sub-agencies--hidden', dd => !newOpened.includes(dd.taId));
      });

    rowsLeft.append('div')
      .attr('class', 'sidebar__sparkline-legend-check')
      .on('click', (d) => {
        updateTAFilter(d.taId);
      });


    const checks = legendContainer.selectAll('.sidebar__sparkline-legend-check');

    saveTAChecks(checks);

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

    setSparkLineLegendChecks({
      checks,
      taFilter,
    });
  },
  setSparkLineLegendChecks({
    checks,
    taFilter,
  }) {
    checks.html((d) => {
      if (taFilter.has(d.taId)) {
        return '<i class="fas fa-square"></i>';
      }
      return '<i class="fas fa-check-square"></i>';
    });
  },
  clearLegend({
    legendContainer,
    resetOpenDropdowns,
  }) {
    legendContainer
      .selectAll('*')
      .remove();

    resetOpenDropdowns([]);
  },
};

export default sidebarLegendFunctions;
