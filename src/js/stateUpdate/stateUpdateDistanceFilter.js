const getStateUpdateDistanceFilter = ({ components }) => function updateDistanceFilter() {
  const {
    distanceDropdown,
    msaAtlas,
  } = components;
  const distanceFilter = this.get('distanceFilter');
  // const msa = this.get('msa');

  distanceDropdown
    .config({
      indicator: distanceFilter,
    })
    .update();

  // msaAtlas
  //   .config({
  //     distanceFilter,
  //   })
  //   .updateData();
  this.getCurrentTractGeo((tractGeo) => {
    msaAtlas
      .config({
        tractGeo,
      })
      .updateData();
  });
};

export default getStateUpdateDistanceFilter;
