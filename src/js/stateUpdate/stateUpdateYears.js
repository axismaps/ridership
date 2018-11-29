const getStateUpdateYear = ({ components }) => function updateYears() {
  const {
    atlas,
    sliderDropdown,
    histogram,
  } = components;
  const years = this.get('years');
  // const nationalMapData = data.get('nationalMapData');
  // console.log('update years', years);
  const nationalMapData = this.getCurrentNationalMapData();

  atlas
    .config({
      nationalMapData,
    })
    .updateYears();

  histogram
    .config({
      nationalMapData,
    })
    .updateData();

  sliderDropdown
    .config({
      years,
    })
    .updateYears();
};

export default getStateUpdateYear;
