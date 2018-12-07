const getStateUpdateNationalDataView = ({ components }) => function updateNationalDataView() {
  const {
    dataViewDropdown,
    atlas,
    histogram,
    sidebar,
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
    .updateNationalDataView();

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
};

export default getStateUpdateNationalDataView;
