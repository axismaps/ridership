import CensusDropdown from '../dropdown/indicatorDropdown';


const getCensusDropdown = ({ data, state }) => new CensusDropdown({
  indicator: state.get('censusField'),
  updateIndicator: (newIndicator) => {
    const currentIndicator = state.get('censusField');
    const years = state.get('years');
    if (newIndicator !== currentIndicator) {
      if (newIndicator.change && years[0] === years[1]) {
        state.update({ years: [years[0], years[1] + 1] });
      }
      state.update({ censusField: newIndicator });
    }
  },
  dropdownOpen: false,
  toggleButton: d3.select('.atlas__census-dropdown-button'),
  toggleButtonText: d3.select('.atlas__census-dropdown-button-text'),
  contentOuterContainer: d3.select('.census-dropdown__content-container'),
  contentContainer: d3.select('.census-dropdown__content'),
  censusFields: data.get('censusFields'),
  indicators: data.get('censusDropdownItems'),
});

export default getCensusDropdown;
