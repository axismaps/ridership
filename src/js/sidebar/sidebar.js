import sparklineFunctions from './sidebarSparklineFunctions';
import pcpFunctions from './sidebarParallelCoordinatePlotFunctions';
import DataProbe from '../dataProbe/dataProbe';
import agencyLegendFunctions from './sidebarAgenciesLegendFunctions';

const privateProps = new WeakMap();

const privateMethods = {
  drawContent() {
    const {
      sidebarView,
      sparkLineAxisContainer,
      width,
    } = privateProps.get(this);
    const {
      clearContent,
      setTopButtonStatus,
      drawNationalSparkLines,
      drawNationalParallelPlot,
      drawNationalCompareList,
    } = privateMethods;
    const {
      toggleSparkLineAxis,
    } = sparklineFunctions;
    const sparkLineView = sidebarView === 'sparkLines';
    clearContent.call(this);
    setTopButtonStatus.call(this);
    sparkLineAxisContainer.style('width', `${width * 0.4}px`);
    toggleSparkLineAxis({
      sparkLineAxisContainer,
      sparkLineView,
    });
    drawNationalCompareList.call(this);
    if (sparkLineView) {
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
      saveTAChecks: (checks) => {
        props.checks = checks;
      },
      getOpenDropdowns: () => props.openedSubDropdowns,
      setOpenDropdowns: (newDropdownList) => {
        props.openedSubDropdowns = newDropdownList;
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
      const currentView = props.sidebarView;
      if (newView === currentView) return;
      props.sidebarView = newView;
      drawContent.call(this);
    };
    parallelButtonContainer
      .on('click', () => {
        setNewView('parallel');
      });

    sparkLineButtonContainer
      .on('click', () => {
        setNewView('sparkLines');
      });

    compareContainer.select('.sidebar__compare-clear-button')
      .on('click', () => updateComparedAgencies([]));
  },
  setTopButtonStatus() {
    const {
      sidebarView,
      parallelButtonContainer,
      sparkLineButtonContainer,
    } = privateProps.get(this);
    parallelButtonContainer
      .classed('sidebar__top-button--active', sidebarView === 'parallel');
    sparkLineButtonContainer
      .classed('sidebar__top-button--active', sidebarView === 'sparkLines');
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
      width,
      mobile,
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
      width,
      mobile,
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
      // searchResult,
      updateMSA,
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
      updateMSA,
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
  setSparkLineAxisDates() {
    const {
      sparkLineAxisYear1,
      sparkLineAxisYear2,
      yearRange,
    } = privateProps.get(this);
    sparkLineAxisYear1.text(yearRange[0]);
    sparkLineAxisYear2.text(yearRange[1]);
  },
  setDimensions() {
    const props = privateProps.get(this);
    const {
      contentContainer,
    } = props;
    const {
      width,
      height,
    } = contentContainer.node()
      .getBoundingClientRect();

    Object.assign(props, { width, height });
  },

};

class Sidebar {
  constructor(config) {
    const {
      drawContent,
      setTopButtonEvents,
      setSparkLineAxisDates,
      setDimensions,
    } = privateMethods;

    privateProps.set(this, {
      dataProbe: new DataProbe({
        container: d3.select('.outer-container'),
      }),
      highlightedAgencies: [],
      searchResult: null,
      openedSubDropdowns: [],
      width: null,
      height: null,
      mobileSidebarOpen: false,
    });

    this.config(config);
    setDimensions.call(this);

    const {
      width,
      sparkLineAxisContainer,
    } = privateProps.get(this);

    sparkLineAxisContainer.style('width', `${width * 0.4}px`);
    setTopButtonEvents.call(this);
    setSparkLineAxisDates.call(this);
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
      sidebarView,
      currentIndicatorDisabled,
    } = privateProps.get(this);

    if (sidebarView === 'sparkLines') {
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
      sidebarView,
      expandedIndicator,
    } = privateProps.get(this);
    if (sidebarView === 'sparkLines') {
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
    const props = privateProps.get(this);
    const {
      pcp,
      agenciesData,
      sidebarView,
      // indicatorSummaries,
      currentScale,
      legendContainer,
    } = props;

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
      resetOpenDropdowns: () => {
        props.openedSubDropdowns = [];
      },
    });
    const msaScale = currentScale === 'msa';
    if (msaScale) {
      drawMSASparkLineLegend.call(this);
    }
    if (sidebarView === 'parallel') {
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
      sidebarView,
    } = privateProps.get(this);

    if (sidebarView === 'parallel') {
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
      sidebarView,
    } = privateProps.get(this);

    if (sidebarView === 'parallel') {
      pcp
        .config({
          searchResult,
        })
        .updateSearchResult();
    }

    return this;
  }

  updateSize() {
    const {
      drawContent,
      setDimensions,
    } = privateMethods;

    setDimensions.call(this);
    drawContent.call(this);

    const {
      width,
      sparkLineAxisContainer,
    } = privateProps.get(this);

    sparkLineAxisContainer.style('width', `${width * 0.4}px`);

    return this;
  }

  updateToggle() {
    const {
      mobileSidebarOpen,
    } = privateProps.get(this);

    const {
      drawContent,
      setDimensions,
    } = privateMethods;

    if (mobileSidebarOpen) {
      setDimensions.call(this);
      drawContent.call(this);
    }
  }

  updateView() {
    const {
      sidebarView,
    } = privateProps.get(this);

    const {
      drawContent,
    } = privateMethods;

    if (sidebarView !== null) {
      drawContent.call(this);
    }
  }

  export() {
    const {
      exportMethods,
      sparkRows,
      sidebarView,
      pcpContainer,
      legendContainer,
      compareContainer,
      yearRange,
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
      legendCanvas.height = compareRows.size() * 18;
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

    if (sidebarView === 'sparkLines') {
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
                const y = rowCanvas.height / 2 - (9 * lines.length / 2) + i * 18;
                ctx.fillText(line, 0, y);
              });

              resolve(rowCanvas);
            });
        }));
      });

      graphicsCanvas.width = 420;
      const ctx = graphicsCanvas.getContext('2d');

      return Promise.all(promises).then((results) => {
        const graphicsHeight = results.reduce((height, rowCanvas) => rowCanvas.height + height, 0);
        graphicsCanvas.height = graphicsHeight + 20;
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        ctx.moveTo(graphicsCanvas.width - 190, 15);
        ctx.lineTo(graphicsCanvas.width - 190, 25);
        ctx.moveTo(graphicsCanvas.width - 10, 15);
        ctx.lineTo(graphicsCanvas.width - 10, 25);
        ctx.stroke();
        ctx.font = '12px Mark, Arial, sans-serif';
        ctx.fillStyle = '#666';
        ctx.textBaseline = 'bottom';
        ctx.fillText(yearRange[0], graphicsCanvas.width - 190, 15);
        ctx.textAlign = 'right';
        ctx.fillText(yearRange[1], graphicsCanvas.width - 10, 15);
        let y = 0;
        results.forEach((rowCanvas) => {
          ctx.drawImage(rowCanvas, 0, y + 20);
          y += rowCanvas.height;
        });
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = graphicsCanvas.width + 40;
        finalCanvas.height = legendCanvas.height + graphicsCanvas.height + 40;
        const finalCtx = finalCanvas.getContext('2d');
        finalCtx.drawImage(legendCanvas, 20, 20);
        finalCtx.drawImage(graphicsCanvas, 20, 20 + legendHeight);
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
      finalCanvas.width = graphicsCanvas.width + 40;
      finalCanvas.height = legendCanvas.height + graphicsCanvas.height + 40;
      const finalCtx = finalCanvas.getContext('2d');
      finalCtx.drawImage(legendCanvas, 20, 20);
      finalCtx.drawImage(graphicsCanvas, 20, 20 + legendHeight);
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
