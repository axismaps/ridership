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
    } else {
      drawMSAContent.call(this);
    }
    this.updateCurrentIndicator();
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
    } = privateProps.get(this);
    const {
      drawNationalSparkLines,
      drawNationalParallelPlot,
    } = privateMethods;
    if (currentSidebarView === 'sparklines') {
      drawNationalSparkLines.call(this);
    } else {
      drawNationalParallelPlot.call(this);
    }
  },
  drawMSAContent() {
    console.log('draw msa sidebar');
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
    } = props;

    const {
      drawSparkLineRows,
      drawSparkLineTitles,
      drawSparkLines,
    } = pureFunctions;

    const sparkRows = drawSparkLineRows({
      contentContainer,
      indicatorSummaries,
      updateIndicator,
    });

    const sparkTitles = drawSparkLineTitles({
      sparkRows,
    });

    const sparkLines = drawSparkLines({
      updateCurrentIndicator,
      yearRange,
      sparkRows,
      currentIndicator,
    });

    Object.assign(props, {
      sparkRows,
      sparkTitles,
      sparkLines,
    });
  },
  drawNationalParallelPlot() {
    console.log('DRAW PARALLEL COORDINATE PLOT');

    const props = privateProps.get(this);

    const {
      contentContainer,
      indicatorSummaries,
      allAgenciesData,
      dataProbe,
      updateIndicator,
    } = props;

    const {
      drawPcpContainer,
      drawPcp,
    } = pcpFunctions;

    const pcpContainer = drawPcpContainer({
      contentContainer,
    });

    const pcp = drawPcp({
      pcpContainer,
      allAgenciesData,
      indicatorSummaries,
      dataProbe,
      updateIndicator,
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
  }

  updateData() {
    const {
      pcp,
      allAgenciesData,
      currentSidebarView,
    } = privateProps.get(this);

    if (currentSidebarView === 'parallel') {
      pcp
        .config({
          allAgenciesData,
        })
        .updateData();
    }

    return this;
  }
}

export default Sidebar;
