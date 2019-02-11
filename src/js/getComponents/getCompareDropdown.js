import CompareDropdown from '../dropdown/compareDropdown';

const getCompareDropdown = ({ state, data }) => new CompareDropdown({
  compareMode: false,
  comparedAgencies: state.get('comparedAgencies'),
  nationalMapData: data.get('allNationalMapData'),
  updateComparedAgencies: (newCompare) => {
    const comparedAgencies = state.get('comparedAgencies');

    let matches = newCompare.length === comparedAgencies.length;
    if (matches) {
      newCompare.forEach((ta, i) => {
        if (comparedAgencies[i].globalId !== ta.globalId) matches = false;
      });
    }
    const updateList = matches ? [] : newCompare;
    state.update({
      compareMode: updateList.length > 0,
      comparedAgencies: updateList,
      searchResult: null,
    });
  },
  updateNationalDataView: (newView) => {
    const nationalDataView = state.get('nationalDataView');
    if (newView !== nationalDataView) {
      state.update({ nationalDataView: newView });
    }
  },
  updateCompareMode: (compareMode) => {
    state.update({ compareMode });
  },
  dropdownOpen: false,
  toggleButton: d3.select('.atlas__compare-dropdown-button'),
  toggleButtonText: d3.select('.atlas__compare-dropdown-button-text'),
  contentOuterContainer: d3.select('.compare-dropdown__content-container'),
  contentContainer: d3.select('.compare-dropdown__content'),
});

export default getCompareDropdown;
