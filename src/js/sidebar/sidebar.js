import pureFunctions from './sidebarSparklineFunctions';
import pcpFunctions from './sidebarParallelCoordinatePlotFunctions';
import DataProbe from '../dataProbe/dataProbe';

const privateProps = new WeakMap();

const privateMethods = {
  drawContent() {
    const {
      currentScale,
    } = privateProps.get(this);
    const {
      drawNationalContent,
      drawMSAContent,
      clearContent,
      setTopButtonStatus,
    } = privateMethods;
    clearContent.call(this);
    setTopButtonStatus.call(this);
    if (currentScale === 'national') {
      drawNationalContent.call(this);
      this.updateCurrentIndicator();
    } else {
      drawMSAContent.call(this);
    }
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
  drawNationalContent() {
    const {
      currentSidebarView,
      comparedAgencies,
    } = privateProps.get(this);
    const {
      drawNationalSparkLines,
      drawNationalParallelPlot,
      drawNationalCompareList,
    } = privateMethods;
    drawNationalCompareList.call(this);
    if (currentSidebarView === 'sparklines') {
      drawNationalSparkLines.call(this);
    } else {
      drawNationalParallelPlot.call(this);
    }
  },
  drawMSAContent() {
    console.log('draw msa sidebar');
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
    } = props;

    const {
      drawSparkLineRows,
      drawSparkLineTitles,
      drawSparkLines,
    } = pureFunctions;
    console.log('drawNationalSparklines', indicatorSummaries);

    const sparkRows = drawSparkLineRows({
      contentContainer,
      indicatorSummaries,
    });

    const sparkTitles = drawSparkLineTitles({
      sparkRows,
      updateExpandedIndicator,
    });

    const sparkLines = drawSparkLines({
      updateCurrentIndicator,
      yearRange,
      sparkRows,
      currentIndicator,
      dataProbe,
      updateIndicator,
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
        highlightedAgencies: [],
      }),
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
    } = privateProps.get(this);

    if (currentSidebarView === 'sparklines') {
      sparkTitles
        .classed('sidebar__sparkline-title--selected', d => currentIndicator.value === d.value);

      sparkLines
        .forEach((sparkLine) => {
          sparkLine
            .config({
              selected: currentIndicator.value === sparkLine.getIndicator().value,
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
    } = pureFunctions;

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
      indicatorSummaries,
    } = privateProps.get(this);

    const {
      drawContent,
      drawNationalCompareList,
    } = privateMethods;

    if (currentSidebarView === 'parallel') {
      pcp
        .config({
          agenciesData,
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
}

export default Sidebar;
