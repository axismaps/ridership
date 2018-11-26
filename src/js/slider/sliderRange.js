import getSliderBase from './sliderBase';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    // const props = privateProps.get(this);
    const {
      setScale,
      updateScale,
      drawSvg,
      updateSvgSize,
      drawDetectionTrack,
      drawBackgroundTrack,
      updateBackgroundTrack,
      updateDetectionTrack,
      drawActiveTrack,
      drawHandles,
      setHandlePositions,
      updateSliderPosition,
      setHandleValueLimits,
      initDrag,
    } = privateMethods;

    setScale.call(this);
    updateScale.call(this);
    drawSvg.call(this);
    updateSvgSize.call(this);
    drawDetectionTrack.call(this);
    updateDetectionTrack.call(this);
    drawBackgroundTrack.call(this);
    updateBackgroundTrack.call(this);
    drawActiveTrack.call(this);
    drawHandles.call(this);
    setHandlePositions.call(this);
    updateSliderPosition.call(this);
    setHandleValueLimits.call(this);
    initDrag.call(this);
  },
  drawHandles() {
    const props = privateProps.get(this);
    const {
      svg,
      handleSize,
      currentValues,
      size,
    } = props;

    // props.handle = svg
    //   .append('g');

    // props.handle
    //   .append('rect')
    //   .attrs({
    //     class: 'slider__handle',
    //     width: handleSize.width,
    //     height: handleSize.height,
    //     y: 0,
    //     x: 0,
    //     rx: 3,
    //     ry: 3,
    //   });
    props.handles = svg.selectAll('.slider__handle')
      .data(currentValues)
      .enter()
      .append('rect')
      .attrs({
        class: 'slider__handle',
        'pointer-events': 'none',
        height: handleSize.height,
        width: handleSize.width,
        y: (size.height / 2) - (handleSize.height / 2),
        rx: 5,
        ry: 5,
      });
  },
  setHandlePositions(values) {
    const {
      scale,
      handles,
      handleSize,
      currentValues,
    } = privateProps.get(this);

    const valuesToUse = values !== undefined ? values : currentValues;

    handles.data(valuesToUse)
      .attrs({
        x: d => scale(d) - (handleSize.width / 2),
      });
  },
  setActiveTrackPosition() {
    const props = privateProps.get(this);
    const {
      scale,
      activeTrack,
      currentValues,
    } = props;
    const width = scale(currentValues[1]) - scale(currentValues[0]);

    if (width < 0) return;

    activeTrack
      .attrs({
        width,
        x: scale(currentValues[0]),
      });
  },
  updateSliderPosition() {
    const {
      setHandlePositions,
      setActiveTrackPosition,
    } = privateMethods;
    setHandlePositions.call(this);
    setActiveTrackPosition.call(this);
  },
  setHandleValueLimits() {
    const props = privateProps.get(this);
    const {
      // xTimeRange,
      // xScale,
      // handleWidth,
      // scale,
      currentValues,
      valueRange,
    } = props;

    props.currentValueLimits = {
      left: [valueRange[0], currentValues[1] - 1],
      right: [currentValues[0] + 1, valueRange[1]],
    };
    console.log('set limits', props.currentValueLimits);
  },
  getCurrentHandle(newValue) {
    const {
      currentValues,
    } = privateProps.get(this);

    let currentHandle;
    if (newValue < currentValues[0]) {
      currentHandle = 'left';
    } else if (newValue > currentValues[1]) {
      currentHandle = 'right';
    } else {
      const leftDistance = Math.abs(newValue - currentValues[0]);
      const rightDistance = Math.abs(newValue - currentValues[1]);
      if (leftDistance <= rightDistance) {
        currentHandle = 'left';
      } else {
        currentHandle = 'right';
      }
    }
    return currentHandle;
  },
  getNewValues(newValue) {
    const {
      currentValues,
      currentHandle,
      currentValueLimits,
    } = privateProps.get(this);

    const limitsForHandle = currentValueLimits[currentHandle];
    if (newValue < limitsForHandle[0]) {
      if (currentHandle === 'left') {
        return [limitsForHandle[0], currentValues[1]];
      }
      return [currentValues[0], limitsForHandle[0]];
    } if (newValue > limitsForHandle[1]) {
      if (currentHandle === 'left') {
        return [limitsForHandle[1], currentValues[1]];
      }
      return [currentValues[0], limitsForHandle[1]];
    }
    if (currentHandle === 'left') {
      return [newValue, currentValues[1]];
    }
    return [currentValues[0], newValue];
  },
  initDrag() {
    const props = privateProps.get(this);
    const {
      scale,
      detectionTrack,
      onDragEnd,
    } = props;

    const {
      getNewValues,
      getCurrentHandle,
      setHandleValueLimits,
    } = privateMethods;

    let newValues;

    detectionTrack.call(d3.drag()
      .on('start.interrupt', () => {
        detectionTrack.interrupt();
      })
      .on('end drag', () => {
        setHandleValueLimits.call(this);
        props.dragging = false;
      })
      .on('start drag', () => {
        const newDate = scale.invert(d3.event.x);
        // console.log('drag', newDate);
        if (!props.dragging) {
          props.dragging = true;
          props.currentHandle = getCurrentHandle.call(this, newDate);
        }
        newValues = getNewValues.call(this, newDate);

        onDragEnd(newValues);
      }));
  },
};

class slider {
  constructor(config) {
    privateProps.set(this, {

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

  update() {
    const {
      // setHandleValueLimits,
      setHandlePositions,
      setActiveTrackPosition,
    } = privateMethods;

    const { currentValues } = privateProps.get(this);
    console.log('UPDATE', currentValues);

    // setHandleValueLimits.call(this);
    setHandlePositions.call(this, currentValues);
    setActiveTrackPosition.call(this, currentValues);
  }
}

Object.assign(
  privateMethods,
  getSliderBase({ privateMethods, privateProps }),
);

export default slider;
