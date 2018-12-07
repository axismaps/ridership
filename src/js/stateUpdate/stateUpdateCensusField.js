const getStateUpdateCensusField = ({ components }) => function updateCensusField() {
  const censusField = this.get('censusField');
  const {
    censusDropdown,
  } = components;

  censusDropdown
    .config({
      indicator: censusField,
    })
    .update();
};

export default getStateUpdateCensusField;
