const privateProps = new WeakMap();

const privateMethods = {

  drawSVG() {
    const props = privateProps.get(this);

    const {
      container,
      // width,
      // height,
    } = props;

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

    console.log('DIM', width, height);
    props.svg = container
      .append('svg')
      .styles({
        width: `${width}px`,
        height: `${height}px`,
      });
  },
};

class Legend {
  constructor(config) {
    const {
      drawSVG,
    } = privateMethods;

    privateProps.set(this, {
      legendOn: true,
      width: null,
      height: null,
    });

    this.config(config);
    this.updateScale();
    drawSVG.call(this);
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
