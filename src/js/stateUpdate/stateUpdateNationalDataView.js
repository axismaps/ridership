const getStateUpdateNationalDataView = ({ components }) => function updateNationalDataView() {
  const {
    dataViewDropdown,
  } = components;

  const nationalDataView = this.get('nationalDataView');

  dataViewDropdown
    .config({
      nationalDataView,
    })
    .update();
};

export default getStateUpdateNationalDataView;
