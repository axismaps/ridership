const getStateUpdateIndicator = ({ components, state }) => function updateIndicator() {
  const {
    indicatorDropdown,
    atlas,
    sidebar,
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

  sidebar
    .config({
      currentIndicator: indicator,
    })
    .updateCurrentIndicator();
};

export default getStateUpdateIndicator;
