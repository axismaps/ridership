const getStateUpdateIndicator = ({ components, state }) => function updateIndicator() {
  const {
    indicatorDropdown,
    atlas,
    sidebar,
    histogram,
  } = components;
  const indicator = state.get('indicator');
  const nationalMapData = state.getCurrentNationalMapData();

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
