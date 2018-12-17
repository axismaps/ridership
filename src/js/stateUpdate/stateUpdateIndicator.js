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
      indicator,
    })
    .updateNationalMapData()
    .updateInteractions();

  histogram
    .config({
      currentIndicator: indicator,
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
