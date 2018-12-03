import pureFunctions from './sidebarSparklineFunctions';
import pcpFunctions from './sidebarParallelCoordinatePlotFunctions';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);

    const {
      contentContainer,
      indicatorSummaries,
      allAgenciesData,
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
    });

    Object.assign(props, {
      pcpContainer,
      pcp,
    });

    Object.assign(props, {
      sparkRows,
      sparkTitles,
      sparkLines,
    });
  },
};

class Sidebar {
  constructor(config) {
    const {
      init,
    } = privateMethods;

    privateProps.set(this, {});

    this.config(config);

    init.call(this);

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

  updateData() {
    const {
      pcp,
      allAgenciesData,
    } = privateProps.get(this);

    pcp
      .config(allAgenciesData)
      .updateData();

    return this;
  }
}

export default Sidebar;
