const getStateUpdateCensusField = ({ components }) => function updateCensusField() {
  const censusField = this.get('censusField');
  const {
    censusDropdown,
    msaAtlas,
  } = components;

  censusDropdown
    .config({
      indicator: censusField,
    })
    .update();

  this.getCurrentTractGeo((tractGeo) => {
    msaAtlas
      .config({
        currentCensusField: censusField,
        tractGeo,
      })
      .updateData();
  });
};

export default getStateUpdateCensusField;
