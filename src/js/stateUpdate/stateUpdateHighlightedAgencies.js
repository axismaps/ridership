const getStateUpdateHighlightedAgencies = ({ components }) => function updateHighlightedAgencies() {
  const {
    atlas,
    histogram,
    sidebar,
  } = components;

  const highlightedAgencies = this.get('highlightedAgencies');
  console.log('highlighted', highlightedAgencies);

  atlas
    .config({
      highlightedAgencies,
    })
    .updateHighlight();

  histogram
    .config({
      highlightedAgencies,
    })
    .updateHighlight();

  // sliderDropdown
  //   .config({
  //     years,
  //   })
  //   .updateYears();

  sidebar
    .config({
      highlightedAgencies,
    })
    .updateHighlight();
};

export default getStateUpdateHighlightedAgencies;
