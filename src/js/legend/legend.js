import legendFunctions from './legendFunctions';

const privateProps = new WeakMap();

const privateMethods = {

  init() {
    const props = privateProps.get(this);

    const {
      container,
      nationalMapData,
      indicator,
    } = props;

    const {
      getRadiusScale,
      drawSVG,
      drawCircles,
      drawDescription,
    } = legendFunctions;

    const radiusScale = getRadiusScale({ nationalMapData });

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
      indicator,
    });

    drawDescription({
      container,
      height,
      width,
      indicator,
    });

    Object.assign(props, {
      svg,
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

  update() {
    const {
      nationalMapData,
      svg,
      width,
      height,
      container,
      indicator,
    } = privateProps.get(this);

    const {
      getRadiusScale,
      drawCircles,
      drawDescription,
    } = legendFunctions;

    const radiusScale = getRadiusScale({ nationalMapData });

    drawCircles({
      svg,
      width,
      height,
      radiusScale,
      indicator,
    });

    drawDescription({
      container,
      height,
      width,
      indicator,
    });
  }

  export() {
    const {
      exportMethods,
      svg,
    } = privateProps.get(this);

    const svgNode = svg.node();
    const { SVGtoCanvas } = exportMethods;

    return SVGtoCanvas({ svgNode }).then((canvas) => {
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = canvas.width || 1;
      finalCanvas.height = canvas.height || 1;
      if (canvas.width === 0) return Promise.resolve(finalCanvas); // empty image for local view
      const ctx = finalCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, 0);
      ctx.font = '12px Mark, Arial, sans-serif';
      ctx.fillStyle = '#333';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom;';
      ctx.fillText('Millions of unlinked', canvas.width / 2, 115);
      ctx.fillText('passenger trips (UPT)', canvas.width / 2, 130);
      return Promise.resolve(finalCanvas);
    });
  }
}

export default Legend;
