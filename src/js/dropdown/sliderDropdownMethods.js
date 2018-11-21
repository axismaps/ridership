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
    const svg = contentContainer.append('svg')
      .styles({
        width: `${width}px`,
        height: `${height}px`,
      });

    const slider = new Slider({
      size: {
        width,
        height,
      },
      handleSize: {
        width: 16,
        height,
      },
      svg,
      valueRange: yearRange,
      values: years,
      updateValues: updateYears,
    });
    return slider;
  },
};

export default sliderPureMethods;
