const getStateUpdateTAFilter = ({ components }) => function updateTAFilter() {
  const {
    sidebar,
  } = components;
  const taFilter = this.get('taFilter');
  const indicatorSummaries = this.getCurrentIndicatorSummaries();

  sidebar
    .config({
      indicatorSummaries,
      taFilter,
    })
    .updateData();
};

export default getStateUpdateTAFilter;
