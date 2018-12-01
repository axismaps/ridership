import pureFunctions from './sidebarSparklineFunctions';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
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
}

export default Sidebar;
