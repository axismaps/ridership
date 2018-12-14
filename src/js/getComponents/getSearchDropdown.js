import SearchDropdown from '../dropdown/searchDropdown';

const getSearchDropdown = ({ state, data }) => new SearchDropdown({
  searchResult: null,
  allNationalMapData: data.get('allNationalMapData'),
  updateSearchResult: (newResult) => {
    state.update({ searchResult: newResult });
    state.update({ compareMode: false });
    state.update({ comparedAgencies: [] });
  },
  nationalDataView: state.get('nationalDataView'),
  dropdownOpen: false,
  toggleButton: d3.select('.atlas__search-dropdown-button'),
  toggleButtonText: d3.select('.atlas__search-dropdown-button-text'),
  contentOuterContainer: d3.select('.search-dropdown__content-container'),
  contentContainer: d3.select('.search-dropdown__content'),
});

export default getSearchDropdown;
