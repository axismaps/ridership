const getStateUpdateYear = ({ components }) => function updateYear() {
  const { atlas } = components;
  // const year = this.get('year');
  // const nationalMapData = data.get('nationalMapData');
  const currentNationalMapData = this.getCurrentNationalMapData();

  atlas
    .config({
      currentNationalMapData,
    })
    .updateYear();
};

export default getStateUpdateYear;
