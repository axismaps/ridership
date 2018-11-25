import Slider from '../slider/sliderRange';

const sliderPureMethods = {
  getSlider({
    contentContainer,
    yearRange,
    years,
    updateYears,
  }) {
    const width = 200;
    const height = 24;
    // const svg = contentContainer.append('svg')
    //   .styles({
    //     width: `${width}px`,
    //     height: `${height}px`,
    //   });

    const slider = new Slider({
      container: contentContainer,
      size: {
        width,
        height,
      },
      handleSize: {
        width: 16,
        height,
      },
      padding: {
        left: 0,
        right: 0,
      },
      // svg,
      valueRange: yearRange,
      currentValues: years,
      onDragEnd: updateYears,
      trackHeight: 7,
    });
    return slider;
  },
};

export default sliderPureMethods;
