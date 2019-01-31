const getStateUpdateSearchResult = ({ components }) => function updateSearchResult() {
  const {
    atlas,
    histogram,
    sidebar,
    searchDropdown,
  } = components;

  const searchResult = this.get('searchResult');

  atlas
    .config({
      searchResult,
    })
    .updateSearchResult();
  if (histogram !== null) {
    histogram
      .config({
        searchResult,
      })
      .updateSearchResult();
  }


  sidebar
    .config({
      searchResult,
    })
    .updateSearchResult();

  searchDropdown
    .config({
      searchResult,
    })
    .update();
};

export default getStateUpdateSearchResult;
