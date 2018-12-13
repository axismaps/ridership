const getStateUpdateTAFilter = ({ components }) => function updateTAFilter() {
  const {
    sidebar,
    msaAtlas,
  } = components;
  const taFilter = this.get('taFilter');
  const indicatorSummaries = this.getCurrentIndicatorSummaries();

  sidebar
    .config({
      indicatorSummaries,
      taFilter,
    })
    .updateData();

  msaAtlas
    .config({
      taFilter,
    })
    .updateAgencyLayers();
};

export default getStateUpdateTAFilter;
