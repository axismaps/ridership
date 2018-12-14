const getStateUpdateNationalDataView = ({ components }) => function updateNationalDataView() {
  const {
    dataViewDropdown,
    atlas,
    histogram,
    sidebar,
    searchDropdown,
  } = components;

  const nationalDataView = this.get('nationalDataView');
  const agenciesData = this.getCurrentAgenciesData();

  dataViewDropdown
    .config({
      nationalDataView,
    })
    .update();

  atlas
    .config({
      nationalDataView,
    })
    .updateNationalDataView()
    .updateInteractions();

  histogram
    .config({
      nationalDataView,
    })
    .updateData();

  sidebar
    .config({
      nationalDataView,
      agenciesData,
    })
    .updateData();

  searchDropdown.config({
    nationalDataView,
  })
    .update();
};

export default getStateUpdateNationalDataView;
