const getStateUpdateDistanceFilter = ({ components }) => function updateDistanceFilter() {
  const {
    distanceDropdown,
    msaAtlas,
    histogram,
    layout,
  } = components;
  const distanceFilter = this.get('distanceFilter');
  // const msa = this.get('msa');

  distanceDropdown
    .config({
      indicator: distanceFilter,
    })
    .update();

  layout
    .config({
      distanceFilter,
    })
    .updateDistanceFilter();


  // msaAtlas
  //   .config({
  //     distanceFilter,
  //   })
  //   .updateData();
  this.getCurrentTractGeo((tractGeo, regionCensus) => {
    msaAtlas
      .config({
        tractGeo,
      })
      .updateData();

    histogram
      .config({
        distanceFilter,
        tractGeo,
        regionCensus,
      })
      .updateData();
  });
};

export default getStateUpdateDistanceFilter;
