import IndicatorDropdown from '../dropdown/indicatorDropdown';

const getIndicatorDropdown = ({ data, state }) => new IndicatorDropdown({
  indicator: state.get('indicator'),
  updateIndicator: (newIndicator) => {
    const currentIndicator = state.get('indicator');
    if (newIndicator !== currentIndicator) {
      state.update({ indicator: newIndicator });
    }
  },
  dropdownOpen: false,
  toggleButton: d3.select('.atlas__indicator-dropdown-button'),
  toggleButtonText: d3.select('.atlas__indicator-dropdown-button-text'),
  contentOuterContainer: d3.select('.indicator-dropdown__content-container'),
  contentContainer: d3.select('.indicator-dropdown__content'),
  indicators: data.get('indicators'),
});

export default getIndicatorDropdown;
