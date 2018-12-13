const getStateUpdateTAFilter = ({ components }) => function updateTAFilter() {
  const {
    sidebar,
  } = components;
  const taFilter = this.get('taFilter');

  sidebar
    .config({
      taFilter,
    })
    .updateTAFilter();
};

export default getStateUpdateTAFilter;
