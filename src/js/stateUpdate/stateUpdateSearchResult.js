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
    });

  histogram
    .config({
      searchResult,
    });

  sidebar
    .config({
      searchResult,
    });

  searchDropdown.config({
    searchResult,
  })
    .update();
};

export default getStateUpdateSearchResult;
