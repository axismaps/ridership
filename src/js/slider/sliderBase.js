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
    } = props;

    props.scale = d3.scaleLinear()
      .domain(valueRange);
    // const { scale } = props;
  },
  updateScale() {
    const {
      size,
      padding,
      // handleWidth,
      handleSize,
      scale,
    } = privateProps.get(this);

    scale
      .range([padding.left + (handleSize.width / 2),
        size.width - padding.right - (handleSize.width / 2)]);
  },
  updateScaleValueRange() {
    const {
      valueRange,
      scale,
    } = privateProps.get(this);
    scale.domain(valueRange);
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
          handleSize,
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
          x >= handlePos.x
          && x <= handlePos.x + handleSize.height
          && y >= handlePos.y
          && y <= handlePos.y + handleSize.height,
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
      x2: scale.range()[1],
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
      class: 'slider__active-track',
      x: padding.left,
      y: (size.height / 2) - (trackHeight / 2),
      height: trackHeight,
      'pointer-events': 'none',
      // rx: 3,
      // ry: 3,
      opacity: 1,
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
