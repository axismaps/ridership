const getStateUpdateMSA = ({ components }) => function updateMSA() {
  const msa = this.get('msa');
  const {
    msaAtlas,
    histogram,
    sidebar,
  } = components;
  const indicatorSummaries = this.getCurrentIndicatorSummaries();
  sidebar
    .config({
      indicatorSummaries,
    })
    .updateData();

  this.update({
    taFilter: new Set(),
  });
  this.getCurrentTractGeo((tractGeo) => {
    msaAtlas
      .config({
        msa,
        tractGeo,
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
