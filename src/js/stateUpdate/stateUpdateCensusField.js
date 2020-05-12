import setAllDropdownPositions from '../dropdown/setDropdownPositions';

const getStateUpdateCensusField = ({ components }) => function updateCensusField() {
  const censusField = this.get('censusField');
  const {
    censusDropdown,
    msaAtlas,
    histogram,
    sliderDropdown,
    yearDropdown,
  } = components;

  if (censusField && typeof ga !== 'undefined') {
    ga('send', 'event', 'data', 'indicator', censusField.id);
  }

  censusDropdown
    .config({
      indicator: censusField,
    })
    .update();

  sliderDropdown.config({
    currentCensusField: censusField,
  }).updateCensusField();

  yearDropdown.config({
    currentCensusField: censusField,
  }).updateCensusField();

  this.getCurrentTractGeo((tractGeo, regionCensus) => {
    msaAtlas
      .config({
        currentCensusField: censusField,
        tractGeo,
      })
      .updateData();
    if (histogram !== null) {
      histogram
        .config({
          currentCensusField: censusField,
          tractGeo,
          regionCensus,
        })
        .updateData();
    }
  });

  setAllDropdownPositions({ components });
};

export default getStateUpdateCensusField;
