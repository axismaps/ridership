const getStateUpdateMSA = ({ components }) => function updateMSA() {
  const msa = this.get('msa');
  const {
    msaAtlas,
    histogram,
    sidebar,
  } = components;

  this.set('taFilter', new Set());

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
