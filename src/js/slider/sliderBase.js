/**
 * Module comprises methods related to slider
 * @module sliderBase
 * @memberof slider
 */
const getSliderBase = ({ privateProps }) => ({
  setScale() {
    const props = privateProps.get(this);
    const {
      valueRange,
      stepSections,
    } = props;

    const domain = stepSections.length === 2
      ? [valueRange[0], stepSections[0].years[1], valueRange[1]]
      : valueRange;
    props.scale = d3.scaleLinear()
      .domain(domain);
    const { scale } = props;

    props.handleScale = d3.scaleLinear()
      .domain(scale.domain());
  },
  updateScale() {
    const {
      size,
      padding,
      handleWidth,
      scale,
      handleScale,
      stepSections,
    } = privateProps.get(this);

    const domain = scale.domain();

    if (stepSections.length === 2) {
      const increments1 = stepSections[0].increment;
      const increments2 = stepSections[1].increment;
      const steps1 = (domain[1] - domain[0]) / increments1;
      const steps2 = (domain[2] - domain[0]) / increments2;

      const pctWayThrough = steps1 / (steps1 + steps2);

      const startPoint = padding.left + (handleWidth / 2);
      const endPoint = size.width - padding.right - (handleWidth / 2);
      const midPoint = (endPoint - startPoint) * pctWayThrough;

      scale
        .range([startPoint, midPoint, endPoint]);
    } else if (stepSections.length === 1) {
      scale
        .range([padding.left + (handleWidth / 2), size.width - padding.right - (handleWidth / 2)]);
    }
    handleScale.range(scale.range());
  },
  updateScaleValueRange() {
    const {
      valueRange,
      scale,
      handleScale,
    } = privateProps.get(this);
    scale.domain(valueRange);
    handleScale.domain(scale.domain());
  },
  drawSvg() {
    const props = privateProps.get(this);
    const { container } = props;

    props.svg = container.append('svg');
  },
  updateSvgSize() {
    const {
      size,
      svg,
    } = privateProps.get(this);

    svg.styles({
      width: `${size.width}px`,
      height: `${size.height}px`,
    });
  },
  drawDetectionTrack() {
    const props = privateProps.get(this);
    const {
      size,
      svg,
    } = props;

    props.detectionTrack = svg.append('g')
      .append('line')
      .attrs({
        class: 'track_overlay',
        'stroke-width': size.height,
        opacity: '0',
        stroke: 'red',
        'pointer-events': 'stroke',
        cursor: 'pointer',
        transform: `translate(${0},${size.height / 2})`,
      })
      .on('mousemove', () => {
        const {
          handle,
          handleHeight,
        } = privateProps.get(this);
        if (handle === undefined) return;

        const handleBBox = handle.node().getBBox();
        const svgBBox = props.svg.node().getBoundingClientRect();

        const handlePos = {
          x: svgBBox.left + handleBBox.x,
          y: svgBBox.top + handleBBox.y,
        };

        const { x, y } = d3.event;

        handle.classed(
          'slider__handle--hover',
          x >= handlePos.x &&
          x <= handlePos.x + handleHeight &&
          y >= handlePos.y &&
          y <= handlePos.y + handleHeight,
        );
      });
  },
  updateDetectionTrack() {
    const {
      detectionTrack,
      scale,
    } = privateProps.get(this);
    detectionTrack.attrs({
      x1: scale.range()[0],
      x2: scale.range().slice(-1)[0],
    });
  },
  drawBackgroundTrack() {
    const props = privateProps.get(this);
    const {
      svg,
      size,
      padding,
      trackHeight,
      backgroundTrackAttrs,
    } = props;

    const defaultAttrs = {
      class: 'slider__track slider__background-track',
      x: padding.left,
      y: (size.height / 2) - (trackHeight / 2),
      height: trackHeight,
      'pointer-events': 'none',
      rx: 3,
      ry: 3,
    };
    const overrideAttrs = backgroundTrackAttrs !== undefined ? backgroundTrackAttrs : {};

    props.backgroundTrack = svg.append('rect')
      .attrs(Object.assign(defaultAttrs, overrideAttrs));
  },
  updateBackgroundTrack() {
    const {
      backgroundTrack,
      scale,
    } = privateProps.get(this);

    backgroundTrack
      .attrs({
        x: scale.range()[0],
        width: scale.range()[scale.range().length - 1] - scale.range()[0],
      });
  },
  drawActiveTrack() {
    const props = privateProps.get(this);
    const {
      svg,
      size,
      padding,
      trackHeight,
      activeTrackAttrs,
    } = props;

    const defaultAttrs = {
      class: 'slider__track slider__active-track',
      x: padding.left,
      y: (size.height / 2) - (trackHeight / 2),
      height: trackHeight,
      'pointer-events': 'none',
      rx: 3,
      ry: 3,
      opacity: 0,
    };

    const overrideAttrs = activeTrackAttrs !== undefined ? activeTrackAttrs : {};

    props.activeTrack = svg.append('rect')
      .attrs(Object.assign(defaultAttrs, overrideAttrs));
  },
  drawHighlightedRange() {
    const props = privateProps.get(this);
    const {
      svg,
      trackHeight,
      size,
    } = props;

    props.highlightedRangeBar = svg.append('rect')
      .attrs({
        class: 'slider__highlighted-range',
        y: (size.height / 2) - (trackHeight / 2),
        'pointer-events': 'none',
        height: trackHeight,
        opacity: 0,
      });
    const highlightedRangeEndProps = {
      class: 'slider__highlighted-range-end',
      cy: size.height / 2,
      r: trackHeight / 2,
      opacity: 0,
    };

    props.highlightedRangeLeftEnd = svg
      .append('circle')
      .attrs(highlightedRangeEndProps);
    props.highlightedRangeRightEnd = svg
      .append('circle')
      .attrs(highlightedRangeEndProps);
  },
});

export default getSliderBase;
