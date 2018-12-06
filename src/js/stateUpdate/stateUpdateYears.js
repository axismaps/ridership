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
  const agenciesData = this.getCurrentAgenciesData();

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
      agenciesData,
      years,
    })
    .updateYears()
    .updateData();
};

export default getStateUpdateYear;
