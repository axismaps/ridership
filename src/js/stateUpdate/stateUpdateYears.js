const getStateUpdateYear = ({ components }) => function updateYears() {
  const { atlas } = components;
  // const years = this.get('years');
  // const nationalMapData = data.get('nationalMapData');
  const nationalMapData = this.getCurrentNationalMapData();

  atlas
    .config({
      nationalMapData,
    })
    .updateYears();
};

export default getStateUpdateYear;
