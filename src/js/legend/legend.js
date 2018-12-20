import legendFunctions from './legendFunctions';

const privateProps = new WeakMap();

const privateMethods = {

  init() {
    const props = privateProps.get(this);

    const {
      container,
      radiusScale,
    } = props;

    const {
      drawSVG,
      drawCircles,
      drawDescription,
    } = legendFunctions;

    const setDimension = (dim) => {
      const currentValue = props[dim];
      if (currentValue !== undefined && currentValue !== null) {
        return;
      }
      props[dim] = container
        .node()
        .getBoundingClientRect()[dim];
    };

    [
      'width',
      'height',
    ].forEach((dim) => {
      setDimension(dim);
    });

    const {
      width,
      height,
    } = props;

    const svg = drawSVG({
      container,
      width,
      height,
    });

    drawCircles({
      svg,
      width,
      height,
      radiusScale,
    });

    drawDescription({
      container,
      height,
      width,
    });
  },
};

class Legend {
  constructor(config) {
    const {
      init,
    } = privateMethods;

    privateProps.set(this, {
      legendOn: true,
      width: null,
      height: null,
      radiusScale: null,
    });

    this.config(config);
    this.updateScale();
    init.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  updateScale() {
    const props = privateProps.get(this);
    const {
      container,
      legendOn,
    } = props;
    container
      .classed('footer__atlas-legend--hidden', !legendOn);
  }
}

export default Legend;
