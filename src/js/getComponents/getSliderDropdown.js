import SliderDropdown from '../dropdown/sliderDropdown';

const sliderDropdown = ({ data, state }) => new SliderDropdown({
  toggleButton: d3.select('.atlas__year-slider-button'),
  toggleButtonText: d3.select('.atlas__year-slider-button-text'),
  contentOuterContainer: d3.select('.year-slider__content-container'),
  contentContainer: d3.select('.year-slider__content'),
  years: state.get('years'),
  updateYears: (newYears) => {
    state.update('years', newYears);
  },
  yearRange: data.get('yearRange'),
});

export default sliderDropdown;
