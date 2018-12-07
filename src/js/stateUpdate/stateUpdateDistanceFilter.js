import getCurrentTractData from '../data/dataTractMethods';

const getStateUpdateDistanceFilter = ({ components, data }) => function updateDistanceFilter() {
  const {
    distanceDropdown,
    msaAtlas,
  } = components;
  const distanceFilter = this.get('distanceFilter');
  const msa = this.get('msa');
  const years = this.get('years');
  const censusField = this.get('censusField');
  distanceDropdown
    .config({
      indicator: distanceFilter,
    })
    .update();

  // msaAtlas
  //   .config({
  //     distanceFilter,
  //   })
  //   .updateData();

  getCurrentTractData({
    msa,
    years,
    data,
    distanceFilter,
    censusField,
    updateComponents(tractGeo) {
      msaAtlas
        .config({
          msa,
          tractGeo,
        })
        .updateMSA();
    },
  });
};

export default getStateUpdateDistanceFilter;
