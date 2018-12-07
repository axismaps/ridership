const getStateUpdateNationalDataView = ({ components }) => function updateNationalDataView() {
  const {
    dataViewDropdown,
    atlas,
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
};

export default getStateUpdateNationalDataView;
