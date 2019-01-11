const getStateUpdateMSA = ({ components }) => function updateMSA() {
  const {
    msaAtlas,
    histogram,
    sidebar,
    msaDropdown,
  } = components;

  this.set('taFilter', new Set());

  const msa = this.get('msa');

  msaDropdown
    .config({
      currentMSA: msa,
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
        msa,
        tractGeo,
      })
      .updateData();
  });
};

export default getStateUpdateMSA;
