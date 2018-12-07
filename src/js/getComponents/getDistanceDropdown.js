import DistanceDropdown from '../dropdown/indicatorDropdown';

const getDistanceDropdown = ({ data, state }) => new DistanceDropdown({
  indicator: state.get('distanceFilter'),
  updateIndicator: (newIndicator) => {
    const currentIndicator = state.get('distanceFilter');
    if (newIndicator !== currentIndicator) {
      state.update({ distanceFilter: newIndicator });
    }
  },
  dropdownOpen: false,
  toggleButton: d3.select('.atlas__distance-dropdown-button'),
  toggleButtonText: d3.select('.atlas__distance-dropdown-text'),
  contentOuterContainer: d3.select('.distance-dropdown__content-container'),
  contentContainer: d3.select('.distance-dropdown__content'),
  indicators: data.get('distanceFilters'),
  defaultText: 'Filter tracts',
  alignMenuToButton: 'right',
});

export default getDistanceDropdown;
