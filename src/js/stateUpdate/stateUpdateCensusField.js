import getCurrentTractData from '../data/dataTractMethods';

const getStateUpdateCensusField = ({ components, data }) => function updateCensusField() {
  const censusField = this.get('censusField');
  const {
    censusDropdown,
    msaAtlas,
  } = components;
  const msa = this.get('msa');
  const years = this.get('years');
  const distanceFilter = this.get('distanceFilter');

  censusDropdown
    .config({
      indicator: censusField,
    })
    .update();

  getCurrentTractData({
    msa,
    years,
    data,
    distanceFilter,
    censusField,
    updateComponents(tractGeo) {
      msaAtlas
        .config({
          currentCensusField: censusField,
          tractGeo,
        })
        .updateData();
    },
  });
};

export default getStateUpdateCensusField;
