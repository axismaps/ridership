const getStateUpdateMSA = ({ components }) => function updateMSA() {
  const {
    msaAtlas,
    histogram,
    sidebar,
    msaDropdown,
    distanceDropdown,
  } = components;

  this.set('taFilter', new Set());

  const msa = this.get('msa');
  this.set('distanceFilter', null);
  const distanceFilter = this.get('distanceFilter');
  console.log('distanceFilter', distanceFilter);

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

  this.getCurrentTractGeo((tractGeo) => {
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
      })
      .updateData();
  });
};

export default getStateUpdateMSA;
