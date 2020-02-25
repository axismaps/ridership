import YearDropdown from '../dropdown/yearDropdown';

const getYearDropdown = ({ data, state }) => new YearDropdown({
  years: state.get('years'),
  yearRange: data.get('msaYearRange'),
  currentCensusField: state.get('censusField'),
  updateYear: (newYear) => {
    const years = state.get('years');
    const yearRange = data.get('msaYearRange');
    if (years[1] !== newYear) {
      const newYear0 = newYear < years[0] ? yearRange[0] : years[0];
      state.update({ years: [newYear0, newYear] });
    }
  },
  dropdownOpen: false,
  toggleButton: d3.select('.atlas__year-dropdown-button'),
  toggleButtonText: d3.select('.atlas__year-dropdown-button-text'),
  contentOuterContainer: d3.select('.year-dropdown__content-container'),
  contentContainer: d3.select('.year-dropdown__content'),
});

export default getYearDropdown;
