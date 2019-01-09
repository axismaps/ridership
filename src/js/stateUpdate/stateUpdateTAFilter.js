const getStateUpdateTAFilter = ({ components }) => function updateTAFilter() {
  const {
    sidebar,
    msaAtlas,
  } = components;
  const taFilter = this.get('taFilter');
  const indicatorSummaries = this.getCurrentIndicatorSummaries();
  const agenciesData = this.getCurrentAgenciesData();

  // console.log('taFilter', taFilter);
  // console.log('agenciesData', agenciesData);

  /**
   * 'agenciesData' lists all agencies, with pct change for each indicator for years selected.
   * This is usually for PCP
   * In this case it is just being used to get colors...
   * @private
   */
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
