import sparklineFunctions from './sidebarSparklineFunctions';
import pcpFunctions from './sidebarParallelCoordinatePlotFunctions';
import DataProbe from '../dataProbe/dataProbe';
import agencyLegendFunctions from './sidebarAgenciesLegendFunctions';
import getPublicMethods from './sidebarPublicFunctions';
import getTopButtonMethods from './sidebarTopButtonFunctions';

const privateProps = new WeakMap();

const privateMethods = {
  drawContent() {
    const {
      sidebarView,
      sparkLineAxisContainer,
      width,
      embedded,
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
    if (embedded) return;
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

    compareContainer.classed('visible', comparedAgencies.length > 0 && !props.embedded);
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
      embedded,
      expandedSparklines,
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
      expandedSparklines,
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
      embedded,
      expandedSparklines,
    });

    drawSparkLineExpandButtons({
      sparkRows,
      updateExpandedIndicator,
      expandedSparklines,
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
      mobile,
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
      mobile,
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
}

Object.assign(
  privateMethods,
  getTopButtonMethods({ privateProps, privateMethods }),
);

Object.assign(
  Sidebar.prototype,
  getPublicMethods({ privateProps, privateMethods }),
);

export default Sidebar;
