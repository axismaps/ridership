const getStateUpdateIndicator = ({ components, state }) => function updateIndicator() {
  const {
    indicatorDropdown,
    atlas,
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
};

export default getStateUpdateIndicator;
