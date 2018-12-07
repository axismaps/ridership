import CompareDropdown from '../dropdown/compareDropdown';

const getCompareDropdown = ({ state, data }) => new CompareDropdown({
  comparedAgencies: state.get('comparedAgencies'),
  nationalMapData: data.get('allNationalMapData'),
  updateComparedAgencies: (newCompare) => {
    const comparedAgencies = state.get('comparedAgencies');
    let matches = newCompare.length === comparedAgencies.length;
    if (matches) {
      newCompare.forEach((ta, i) => {
        if (comparedAgencies[i].taId !== ta.taId) matches = false;
      });
    }
    state.update({ comparedAgencies: matches ? [] : newCompare });
  },
  dropdownOpen: false,
  toggleButton: d3.select('.atlas__compare-dropdown-button'),
  toggleButtonText: d3.select('.atlas__compare-dropdown-button-text'),
  contentOuterContainer: d3.select('.compare-dropdown__content-container'),
  contentContainer: d3.select('.compare-dropdown__content'),
});

export default getCompareDropdown;
