const getStateUpdateNationalDataView = ({ components }) => function updateNationalDataView() {
  const {
    dataViewDropdown,
    atlas,
    histogram,
  } = components;

  const nationalDataView = this.get('nationalDataView');

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
};

export default getStateUpdateNationalDataView;
