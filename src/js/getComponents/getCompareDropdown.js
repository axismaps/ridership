import CompareDropdown from '../dropdown/compareDropdown';

const getCompareDropdown = ({ state, data }) => new CompareDropdown({
  comparedAgencies: state.get('comparedAgencies'),
  nationalMapData: data.get('allNationalMapData'),
  updateComparedAgencies: (newCompare) => {
    const comparedAgencies = state.get('comparedAgencies');
    const nationalDataView = state.get('nationalDataView');
    let matches = newCompare.data.length === comparedAgencies.length;
    if (matches) {
      newCompare.data.forEach((ta, i) => {
        if (comparedAgencies[i].taId !== ta.taId) matches = false;
      });
    }
    if (newCompare.nationalDataView !== undefined
      && newCompare.nationalDataView !== nationalDataView) {
      state.update({ nationalDataView: newCompare.nationalDataView });
    }
    state.update({ comparedAgencies: matches ? [] : newCompare.data });
  },
  dropdownOpen: false,
  toggleButton: d3.select('.atlas__compare-dropdown-button'),
  toggleButtonText: d3.select('.atlas__compare-dropdown-button-text'),
  contentOuterContainer: d3.select('.compare-dropdown__content-container'),
  contentContainer: d3.select('.compare-dropdown__content'),
});

export default getCompareDropdown;
