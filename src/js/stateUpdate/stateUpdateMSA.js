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
  sidebar
    .config({
      indicatorSummaries,
      currentAgencies,
      taFilter,
    })
    .updateData();

  this.getCurrentTractGeo((tractGeo) => {
    console.log('GET TRACT GEO');
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
