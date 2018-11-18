import IndicatorDropdown from '../dropdown/indicatorDropdown';

const indicatorDropdown = ({ data, state }) => new IndicatorDropdown({
  toggleButton: d3.select('.atlas__indicator-dropdown-button'),
  toggleButtonText: d3.select('.atlas__indicator-dropdown-button-text'),
  contentOuterContainer: d3.select('.indicator-dropdown__content-container'),
  contentContainer: d3.select('.indicator-dropdown__content'),
  indicator: state.get('indicator'),
  updateIndicator: (newIndicator) => {
    const currentIndicator = state.get('indicator');
    if (newIndicator !== currentIndicator) {
      state.update({ indicator: newIndicator });
    }
  },
  indicators: data.get('indicators'),
});

export default indicatorDropdown;
