import pureFunctions from './sidebarSparklineFunctions';

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
    } = props;

    const {
      drawSparkLineRows,
      drawSparkLineTitles,
      drawSparkLines,
    } = pureFunctions;

    const sparkRows = drawSparkLineRows({
      contentContainer,
      indicatorSummaries,
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

  },
};

class Sidebar {
  constructor(config) {
    const {
      drawContent,
      setTopButtonEvents,
    } = privateMethods;

    privateProps.set(this, {});

    this.config(config);
    setTopButtonEvents.call(this);
    drawContent.call(this);

    this.updateCurrentIndicator();
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
    } = privateProps.get(this);

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
  }
}

export default Sidebar;
