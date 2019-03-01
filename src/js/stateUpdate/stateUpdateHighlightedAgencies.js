const getStateUpdateHighlightedAgencies = ({ components }) => function updateHighlightedAgencies() {
  const {
    atlas,
    histogram,
    sidebar,
  } = components;

  const highlightedAgencies = this.get('highlightedAgencies');

  sidebar
    .config({
      highlightedAgencies,
    })
    .updateHighlight();

  if (atlas) {
    atlas
      .config({
        highlightedAgencies,
      })
      .updateHighlight();
  }


  if (histogram) {
    histogram
      .config({
        highlightedAgencies,
      })
      .updateHighlight();
  }


  // sliderDropdown
  //   .config({
  //     years,
  //   })
  //   .updateYears();
};

export default getStateUpdateHighlightedAgencies;
