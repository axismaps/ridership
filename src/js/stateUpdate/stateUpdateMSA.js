import getCurrentTractData from '../data/dataTractMethods';

const getStateUpdateMSA = ({ components, data }) => function updateMSA() {
  const msa = this.get('msa');
  const years = this.get('years');
  const distanceFilter = this.get('distanceFilter');
  const censusField = this.get('censusField');

  getCurrentTractData({
    msa,
    years,
    data,
    distanceFilter,
    censusField,
    updateComponents(tractGeo) {
      const {
        msaAtlas,
      } = components;

      msaAtlas
        .config({
          msa,
          tractGeo,
        })
        .updateMSA();
    },
  });
};

export default getStateUpdateMSA;
