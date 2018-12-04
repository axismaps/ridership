const getStateUpdateHighlightedAgencies = ({ components }) => function updateHighlightedAgencies() {
  const {
    atlas,
    histogram,
    sidebar,
  } = components;

  const highlightedAgencies = this.get('highlightedAgencies');
  // const years = this.get('highlightedAgencies');
  // // const nationalMapData = data.get('nationalMapData');
  // // console.log('update years', years);
  // const nationalMapData = this.getCurrentNationalMapData();
  // const allAgenciesData = this.getCurrentAllAgenciesData();

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
