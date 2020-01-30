import CensusDropdown from '../dropdown/indicatorDropdown';


const getCensusDropdown = ({ data, state }) => new CensusDropdown({
  indicator: state.get('censusField'),
  updateIndicator: (newIndicator) => {
    const currentIndicator = state.get('censusField');
    if (newIndicator !== currentIndicator) {
      state.update({ censusField: newIndicator });
    }
  },
  dropdownOpen: false,
  toggleButton: d3.select('.atlas__census-dropdown-button'),
  toggleButtonText: d3.select('.atlas__census-dropdown-button-text'),
  contentOuterContainer: d3.select('.census-dropdown__content-container'),
  contentContainer: d3.select('.census-dropdown__content'),
  indicators: data.get('censusDropdownItems'),
});

export default getCensusDropdown;
