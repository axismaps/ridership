import atlasMethods from './atlasMethods';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);

    const {
      mapContainer,
      width,
      height,
      statesTopo,
    } = props;

    const {
      drawMapSVG,
      drawStates,
    } = atlasMethods;

    const mapSVG = drawMapSVG({
      mapContainer,
      width,
      height,
    });

    const states = drawStates({
      mapSVG,
      width,
      height,
      statesTopo,
    });

    Object.assign(props, {
      states,
      mapSVG,
    });
  },
};

class Atlas {
  constructor(config) {
    const mapContainer = d3.select('.atlas__map-container');
    const {
      width,
      height,
    } = mapContainer.node().getBoundingClientRect();
    privateProps.set(this, {
      mapContainer,
      width,
      height,
      statesTopo: null,
    });
    const {
      init,
    } = privateMethods;

    this.config(config);

    init.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
}

export default Atlas;
