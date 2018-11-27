import pureFunctions from './sidebarMethods';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);

    const {
      contentContainer,
      indicatorSummaries,
    } = props;

    const {
      drawSparklineRows,
    } = pureFunctions;

    drawSparklineRows({
      contentContainer,
      indicatorSummaries,
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
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
}

export default Sidebar;
