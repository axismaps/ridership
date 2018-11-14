const getStateUpdateYear = ({ components }) => function updateYear() {
  const { atlas } = components;
  // const year = this.get('year');
  // const nationalMapData = data.get('nationalMapData');
  const nationalMapData = this.getCurrentNationalMapData();

  atlas
    .config({
      nationalMapData,
    })
    .updateYear();
};

export default getStateUpdateYear;
