const getStateUpdateYear = ({ components }) => function updateYears() {
  const {
    atlas,
    sliderDropdown,
    histogram,
    sidebar,
  } = components;
  const years = this.get('years');
  // const nationalMapData = data.get('nationalMapData');
  // console.log('update years', years);
  const nationalMapData = this.getCurrentNationalMapData();
  const allAgenciesData = this.getCurrentAllAgenciesData();

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

  sidebar
    .config({
      allAgenciesData,
    })
    .updateData();
};

export default getStateUpdateYear;
