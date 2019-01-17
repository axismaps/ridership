const getUpdateHighlightedTractValue = ({ components }) => function updateHighlightedTractValue() {
  const {
    atlas,
    histogram,
    sidebar,
  } = components;

  const highlightedTractValue = this.get('highlightedTractValue');
  console.log('highlighted', highlightedTractValue);

  // atlas
  //   .config({
  //     highlightedTractValue,
  //   })
  //   .updateHighlight();

  histogram
    .config({
      highlightedTractValue,
    })
    .updateHighlightedTractValue();

  // sidebar
  //   .config({
  //     highlightedTractValue,
  //   })
  //   .updateHighlight();
};

export default getUpdateHighlightedTractValue;
