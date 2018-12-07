const getStateUpdateDistanceFilter = ({ components }) => function updateDistanceFilter() {
  const {
    distanceDropdown,
    msaAtlas,
  } = components;
  const distanceFilter = this.get('distanceFilter');
  distanceDropdown
    .config({
      indicator: distanceFilter,
    })
    .update();

  msaAtlas
    .config({
      distanceFilter,
    })
    .updateData();
};

export default getStateUpdateDistanceFilter;
