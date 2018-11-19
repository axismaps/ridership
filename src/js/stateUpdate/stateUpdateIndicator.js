const getStateUpdateIndicator = ({ components, state }) => function updateIndicator() {
  const {
    indicatorDropdown,
  } = components;
  const indicator = state.get('indicator');

  indicatorDropdown
    .config({
      indicator,
    })
    .update();
};

export default getStateUpdateIndicator;
