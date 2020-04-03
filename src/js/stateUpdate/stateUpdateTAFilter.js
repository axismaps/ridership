const getStateUpdateTAFilter = ({ components }) => function updateTAFilter() {
  const {
    sidebar,
    msaAtlas,
    histogram,
  } = components;
  const taFilter = this.get('taFilter');
  const indicatorSummaries = this.getCurrentIndicatorSummaries();
  const agenciesData = this.getCurrentAgenciesData();
  const msa = this.get('msa');

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

  if (!msa) {
    // when exiting msa mode and clearing the filter
    msaAtlas
      .config({
        taFilter,
      })
      .updateAgencyLayers();
  } else {
    this.getCurrentTractGeo((tractGeo) => {
      msaAtlas
        .config({
          tractGeo,
          taFilter,
        })
        .updateData()
        .updateAgencyLayers();

      histogram
        .config({
          tractGeo,
        })
        .updateData();
    });
  }
};

export default getStateUpdateTAFilter;
