const getStateUpdateIndicator = ({ components }) => function updateIndicator() {
  const {
    indicatorDropdown,
    atlas,
    sidebar,
    histogram,
  } = components;
  const indicator = this.get('indicator');
  const nationalMapData = this.getCurrentNationalMapData();

  indicatorDropdown
    .config({
      indicator,
    })
    .update();

  atlas
    .config({
      nationalMapData,
    })
    .updateNationalMapData();

  histogram
    .config({
      nationalMapData,
    })
    .updateData();

  sidebar
    .config({
      currentIndicator: indicator,
    })
    .updateCurrentIndicator();
};

export default getStateUpdateIndicator;
