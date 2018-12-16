const getStateUpdateTAFilter = ({ components }) => function updateTAFilter() {
  const {
    sidebar,
    msaAtlas,
  } = components;
  const taFilter = this.get('taFilter');
  const indicatorSummaries = this.getCurrentIndicatorSummaries();
  const agenciesData = this.getCurrentAgenciesData();
  // console.log('Agencies?', agenciesData);
  // if (agenciesData !== null) {
  //   sidebar
  //     .config({
  //       agenciesData,
  //     });
  // }
  sidebar
    .config({
      indicatorSummaries,
      taFilter,
      agenciesData,
    })
    .updateData();

  msaAtlas
    .config({

      taFilter,
    })
    .updateAgencyLayers();
};

export default getStateUpdateTAFilter;
