const getStateUpdateCompareMode = ({ components }) => function updateCompareMode() {
  const {
    atlas,
    histogram,
    sidebar,
    compareDropdown,
  } = components;

  const compareMode = this.get('compareMode');

  d3.select('.outer-container').classed('compare', compareMode);

  compareDropdown
    .config({
      compareMode,
    })
    .update();

  atlas
    .config({
      compareMode,
    })
    .updateInteractions();
  if (histogram !== null) {
    histogram
      .config({
        compareMode,
      });
  }


  sidebar
    .config({
      compareMode,
    })
    .updateData();
};

export default getStateUpdateCompareMode;
