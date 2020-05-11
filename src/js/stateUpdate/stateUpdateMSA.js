const getStateUpdateMSA = ({ components }) => function updateMSA() {
  const {
    msaAtlas,
    histogram,
    sidebar,
    msaDropdown,
    layout,
    distanceDropdown,
  } = components;

  this.set('taFilter', new Set());

  const msa = this.get('msa');
  this.set('distanceFilter', null);
  const distanceFilter = this.get('distanceFilter');

  if (msa) {
    ga('send', 'event', 'data', 'msa', msa.msaId);
  }

  msaDropdown
    .config({
      currentMSA: msa,
    })
    .update();

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

  if (msa === null) return;


  const taFilter = this.get('taFilter');
  const indicatorSummaries = this.getCurrentIndicatorSummaries();
  const currentAgencies = this.getAllAgenciesForCurrentMSA();
  const agenciesData = this.getCurrentAgenciesData();

  sidebar
    .config({
      indicatorSummaries,
      currentAgencies,
      taFilter,
      agenciesData,
    })
    .updateData();
  this.update({ loading: true });
  this.getCurrentTractGeo((tractGeo, regionCensus) => {
    msaAtlas
      .config({
        msa,
        tractGeo,
        currentAgencies,
        taFilter,
      })
      .updateMSA();

    histogram
      .config({
        distanceFilter,
        msa,
        tractGeo,
        regionCensus,
      })
      .updateData();

    this.update({ loading: false });
  });
};

export default getStateUpdateMSA;
