import sparklineFunctions from './sidebarSparklineFunctions';
import pcpFunctions from './sidebarParallelCoordinatePlotFunctions';
import DataProbe from '../dataProbe/dataProbe';
import agencyLegendFunctions from './sidebarAgenciesLegendFunctions';

const privateProps = new WeakMap();

const privateMethods = {
  drawContent() {
    const {
      currentSidebarView,
    } = privateProps.get(this);
    const {
      clearContent,
      setTopButtonStatus,
      drawNationalSparkLines,
      drawNationalParallelPlot,
      drawNationalCompareList,
    } = privateMethods;
    clearContent.call(this);
    setTopButtonStatus.call(this);
    drawNationalCompareList.call(this);
    if (currentSidebarView === 'sparklines') {
      drawNationalSparkLines.call(this);
    } else {
      drawNationalParallelPlot.call(this);
    }
    this.updateCurrentIndicator();
  },
  drawMSASparkLineLegend() {
    const props = privateProps.get(this);
    const {
      updateTAFilter,
      contentContainer,
      currentAgencies,
      taFilter,
      legendContainer,
    } = props;
    const {
      drawMSASparkLineLegend,
    } = agencyLegendFunctions;
    drawMSASparkLineLegend({
      legendContainer,
      updateTAFilter,
      contentContainer,
      currentAgencies,
      taFilter,
      logTAChecks: (checks) => {
        props.checks = checks;
      },
    });
  },
  clearContent() {
    const {
      contentContainer,
    } = privateProps.get(this);

    contentContainer.selectAll('div').remove();
  },
  setTopButtonEvents() {
    const props = privateProps.get(this);
    const {
      parallelButtonContainer,
      sparkLineButtonContainer,
      compareContainer,
      updateComparedAgencies,
    } = props;
    const {
      drawContent,
    } = privateMethods;
    const setNewView = (newView) => {
      const currentView = props.currentSidebarView;
      if (newView === currentView) return;
      props.currentSidebarView = newView;
      drawContent.call(this);
    };
    parallelButtonContainer
      .on('click', () => {
        setNewView('parallel');
      });

    sparkLineButtonContainer
      .on('click', () => {
        setNewView('sparklines');
      });

    compareContainer.select('.sidebar__compare-clear-button')
      .on('click', () => updateComparedAgencies([]));
  },
  setTopButtonStatus() {
    const {
      currentSidebarView,
      parallelButtonContainer,
      sparkLineButtonContainer,
    } = privateProps.get(this);
    parallelButtonContainer
      .classed('sidebar__top-button--active', currentSidebarView === 'parallel');
    sparkLineButtonContainer
      .classed('sidebar__top-button--active', currentSidebarView === 'sparklines');
  },

  drawNationalCompareList() {
    const props = privateProps.get(this);

    const {
      comparedAgencies,
      updateComparedAgencies,
      compareContainer,
      updateHighlightedAgencies,
    } = props;

    const rows = compareContainer.select('.sidebar__compare-rows')
      .selectAll('.sidebar__compare-row')
      .data(comparedAgencies, d => d.globalId);
    const newRows = rows
      .enter()
      .append('div')
      .attr('class', 'sidebar__compare-row')
      .on('mouseover', d => updateHighlightedAgencies([d]))
      .on('mouseout', () => updateHighlightedAgencies([]))
      .text(d => d.taName || d.name);
    newRows.append('i')
      .attr('class', 'fa fa-times');

    newRows.merge(rows)
      .select('i')
      .on('click', (d) => {
        const others = comparedAgencies.slice()
          .filter(a => a.globalId !== d.globalId);
        updateComparedAgencies(others);
        compareContainer.selectAll('.sidebar__compare-row')
          .filter(rowData => rowData.globalId === d.globalId)
          .remove();
      });

    rows.exit().remove();

    compareContainer.classed('visible', comparedAgencies.length > 0);
  },
  drawNationalSparkLines() {
    const props = privateProps.get(this);

    const {
      contentContainer,
      indicatorSummaries,
      yearRange,
      currentIndicator,
      updateCurrentIndicator,
      updateIndicator,
      updateExpandedIndicator,
      dataProbe,
      currentScale,
    } = props;

    const {
      drawSparkLineRows,
      drawSparkLineTitles,
      drawSparkLines,
      drawSparkLineExpandButtons,
    } = sparklineFunctions;

    const sparkRows = drawSparkLineRows({
      contentContainer,
      indicatorSummaries,
    });

    const sparkTitles = drawSparkLineTitles({
      sparkRows,
      updateIndicator,
    });

    const sparkLines = drawSparkLines({
      updateCurrentIndicator,
      yearRange,
      sparkRows,
      currentIndicator,
      dataProbe,
      updateIndicator,
      currentScale,
    });

    drawSparkLineExpandButtons({
      sparkRows,
      updateExpandedIndicator,
    });

    Object.assign(props, {
      sparkRows,
      sparkTitles,
      sparkLines,
    });
  },
  drawNationalParallelPlot() {
    const props = privateProps.get(this);

    const {
      contentContainer,
      indicatorSummaries,
      agenciesData,
      dataProbe,
      updateIndicator,
      updateHighlightedAgencies,
      years,
      currentScale,
      searchResult,
    } = props;

    const {
      drawPcpContainer,
      drawPcp,
    } = pcpFunctions;

    const pcpContainer = drawPcpContainer({
      contentContainer,
      years,
    });


    const pcp = drawPcp({
      currentScale,
      pcpContainer,
      agenciesData,
      indicatorSummaries,
      dataProbe,
      updateIndicator,
      updateHighlightedAgencies,
    });

    Object.assign(props, {
      pcpContainer,
      pcp,
    });

    this.updateSearchResult();
  },

  getMutlilineText({
    text,
    maxWidth,
    ctx,
  }) {
    const lines = [];
    const words = text.split(' ');
    words.forEach((word) => {
      if (lines.length === 0) {
        lines.push(word);
      } else {
        const newLine = `${lines[lines.length - 1]} ${word}`;
        if (ctx.measureText(newLine).width > maxWidth && newLine.includes(' ')) {
          lines.push(word);
        } else {
          lines[lines.length - 1] = newLine;
        }
      }
    });

    return lines;
  },
};

class Sidebar {
  constructor(config) {
    const {
      drawContent,
      setTopButtonEvents,
    } = privateMethods;

    privateProps.set(this, {
      dataProbe: new DataProbe({
        container: d3.select('.outer-container'),
      }),
      highlightedAgencies: [],
      searchResult: null,
    });

    this.config(config);
    setTopButtonEvents.call(this);
    drawContent.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  updateCurrentIndicator() {
    const {
      currentIndicator,
      sparkLines,
      sparkTitles,
      pcp,
      currentSidebarView,
      currentIndicatorDisabled,
    } = privateProps.get(this);

    if (currentSidebarView === 'sparklines') {
      sparkTitles
        .classed('sidebar__sparkline-title--selected', d => currentIndicator.value === d.value
        && !currentIndicatorDisabled);

      sparkLines
        .forEach((sparkLine) => {
          sparkLine
            .config({
              selected: currentIndicator.value === sparkLine.getIndicator().value
              && !currentIndicatorDisabled,
            })
            .updateSelected();
        });
    } else {
      pcp.config({
        currentIndicator,
      })
        .updateSelected();
    }

    return this;
  }

  updateExpandedIndicator() {
    const {
      updateExpandedSparkline,
    } = sparklineFunctions;

    const {
      sparkRows,
      sparkLines,
      currentSidebarView,
      expandedIndicator,
    } = privateProps.get(this);
    if (currentSidebarView === 'sparklines') {
      updateExpandedSparkline({
        sparkRows,
        sparkLines,
        expandedIndicator,
      });
    }

    return this;
  }

  updateYears() {
    const {
      contentContainer,
      years,
    } = privateProps.get(this);

    contentContainer.select('span.sidebar__pcp-years').html(`${years.join(' – ')}`);

    return this;
  }

  updateData() {
    const {
      pcp,
      agenciesData,
      currentSidebarView,
      // indicatorSummaries,
      currentScale,
      legendContainer,
    } = privateProps.get(this);

    const {
      drawContent,
      drawNationalCompareList,
      drawMSASparkLineLegend,
    } = privateMethods;
    const {
      clearLegend,
    } = agencyLegendFunctions;
    clearLegend({
      legendContainer,
    });
    const msaScale = currentScale === 'msa';
    if (msaScale) {
      drawMSASparkLineLegend.call(this);
    }
    if (currentSidebarView === 'parallel') {
      pcp
        .config({
          agenciesData,
          msaScale: currentScale === 'msa',
        })
        .updateData();
      drawNationalCompareList.call(this);
    } else {
      drawContent.call(this);
    }

    return this;
  }

  updateHighlight() {
    const {
      pcp,
      highlightedAgencies,
      currentSidebarView,
    } = privateProps.get(this);

    if (currentSidebarView === 'parallel') {
      pcp
        .config({
          highlightedAgencies,
        })
        .updateHighlight();
    }

    return this;
  }

  updateSearchResult() {
    const {
      pcp,
      searchResult,
      currentSidebarView,
    } = privateProps.get(this);

    if (currentSidebarView === 'parallel') {
      pcp
        .config({
          searchResult,
        })
        .updateSearchResult();
    }

    return this;
  }

  export() {
    const {
      exportMethods,
      sparkRows,
      currentSidebarView,
      pcpContainer,
      legendContainer,
      compareContainer,
    } = privateProps.get(this);

    const {
      getMutlilineText,
    } = privateMethods;

    const { SVGtoCanvas } = exportMethods;

    const graphicsCanvas = document.createElement('canvas');
    const legendCanvas = document.createElement('canvas');
    legendCanvas.width = 420;
    const legendCtx = legendCanvas.getContext('2d');
    const sparklinesLegendRows = legendContainer.selectAll('.sidebar__sparkline-legend-row');
    const compareRows = compareContainer.selectAll('.sidebar__compare-row');
    let legendHeight = 0;
    if (sparklinesLegendRows.size() > 0) {
      legendCanvas.height = legendContainer.node().offsetHeight;
      legendCtx.font = '15px Mark, Arial, sans-serif';
      legendCtx.textBaseline = 'bottom';
      sparklinesLegendRows.each((d) => {
        legendCtx.fillStyle = d.color;
        legendCtx.fillRect(0, legendHeight + 3, 12, 12);

        const lines = getMutlilineText({
          text: d.taName,
          maxWidth: 200,
          ctx: legendCtx,
        });
        legendCtx.fillStyle = '#666';
        lines.forEach((line, lineNumber) => {
          legendHeight += 18;
          legendCtx.fillText(line, 32, legendHeight);
        });
      });
    } else if (compareRows.size() > 0) {
      legendCanvas.height = compareContainer.node().offsetHeight;
      legendCtx.font = '15px Mark, Arial, sans-serif';
      legendCtx.textBaseline = 'bottom';
      legendCtx.fillStyle = '#666';
      legendHeight = 18;
      legendCtx.fillText('Comparing:', 0, legendHeight);
      compareRows.each((d) => {
        const lines = getMutlilineText({
          text: d.name || d.taName,
          maxWidth: legendCanvas.width - 40,
          ctx: legendCtx,
        });
        lines.forEach((line, lineNumber) => {
          legendHeight += 18;
          legendCtx.fillText(line, 20, legendHeight);
        });
      });
    } else {
      legendCanvas.height = 1;
    }

    if (currentSidebarView === 'sparklines') {
      const promises = [];
      sparkRows.each(function exportSparkline() {
        const svgNode = d3.select(this).select('svg').node();
        const title = d3.select(this).select('.sidebar__sparkline-title');
        promises.push(new Promise((resolve) => {
          SVGtoCanvas({ svgNode })
            .then((canvas) => {
              const rowCanvas = document.createElement('canvas');
              rowCanvas.width = 420;
              rowCanvas.height = canvas.height;
              const ctx = rowCanvas.getContext('2d');
              ctx.drawImage(canvas, rowCanvas.width - canvas.width, 0);
              if (title.classed('sidebar__sparkline-title--selected')) {
                ctx.font = 'bold 15px Mark, Arial, sans-serif';
                ctx.fillStyle = '#2D74ED';
              } else {
                ctx.font = '15px Mark, Arial, sans-serif';
                ctx.fillStyle = '#666';
              }
              ctx.textBaseline = 'middle';

              const lines = getMutlilineText({
                text: title.text(),
                maxWidth: rowCanvas.width - canvas.width - 15,
                ctx,
              });

              lines.forEach((line, i) => {
                const y = 30 - (9 * lines.length / 2) + i * 18;
                ctx.fillText(line, 0, y);
              });

              resolve(rowCanvas);
            });
        }));
      });

      graphicsCanvas.width = 420;
      graphicsCanvas.height = sparkRows.size() * 60;
      const ctx = graphicsCanvas.getContext('2d');
      return Promise.all(promises).then((results) => {
        results.forEach((rowCanvas, i) => {
          ctx.drawImage(rowCanvas, 0, i * 60);
        });
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = graphicsCanvas.width;
        finalCanvas.height = legendCanvas.height + graphicsCanvas.height;
        const finalCtx = finalCanvas.getContext('2d');
        finalCtx.drawImage(legendCanvas, 0, 0);
        finalCtx.drawImage(graphicsCanvas, 0, legendHeight);
        return Promise.resolve(finalCanvas);
      });
    }

    const svgNode = pcpContainer.select('svg').node();
    return SVGtoCanvas({ svgNode }).then((canvas) => {
      const headerHeight = 20;
      graphicsCanvas.width = 420;
      graphicsCanvas.height = canvas.height + headerHeight;
      const ctx = graphicsCanvas.getContext('2d');
      ctx.drawImage(canvas, graphicsCanvas.width - canvas.width - 15, headerHeight);
      ctx.textBaseline = 'middle';
      ctx.font = '12px Mark, Arial, sans-serif';
      ctx.fillStyle = '#666';
      ctx.textAlign = 'center';
      ctx.fillText(d3.select('.sidebar__pcp-header').text(), graphicsCanvas.width - 0.5 * canvas.width, 18);
      ctx.textAlign = 'left';
      pcpContainer.selectAll('.sidebar__pcp-row').each(function drawTitle(d, row) {
        if (d3.select(this).classed('sidebar__pcp-row--selected')) {
          ctx.font = 'bold 15px Mark, Arial, sans-serif';
          ctx.fillStyle = '#2D74ED';
        } else {
          ctx.font = '15px Mark, Arial, sans-serif';
          ctx.fillStyle = '#666';
        }
        const lines = getMutlilineText({
          text: d3.select(this).select('p').text(),
          maxWidth: 180,
          ctx,
        });
        lines.forEach((line, i) => {
          const y = headerHeight + 30 - (9 * lines.length / 2) + i * 18 + row * 60;
          ctx.fillText(line, 0, y);
        });
      });
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = graphicsCanvas.width;
      finalCanvas.height = legendCanvas.height + graphicsCanvas.height;
      const finalCtx = finalCanvas.getContext('2d');
      finalCtx.drawImage(legendCanvas, 0, 0);
      finalCtx.drawImage(graphicsCanvas, 0, legendHeight);
      return Promise.resolve(finalCanvas);
    });
  }

  // updateTAFilter() {
  //   const {
  //     checks,
  //     taFilter,
  //   } = privateProps.get(this);
  //   const {
  //     setSparkLineLegendChecks,
  //   } = sparklineFunctions;

  //   setSparkLineLegendChecks({
  //     checks,
  //     taFilter,
  //   });
  //   return this;
  // }
}

export default Sidebar;
