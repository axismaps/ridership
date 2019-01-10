import setAllDropdownPositions from '../dropdown/setDropdownPositions';

const getStateUpdateCensusField = ({ components }) => function updateCensusField() {
  const censusField = this.get('censusField');
  const {
    censusDropdown,
    msaAtlas,
    histogram,
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
    histogram
      .config({
        currentCensusField: censusField,
        tractGeo,
      })
      .updateData();
  });

  setAllDropdownPositions({ components });
};

export default getStateUpdateCensusField;
