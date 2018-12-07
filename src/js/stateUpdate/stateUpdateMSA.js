import updateTractData from '../data/dataTractMethods';

const getStateUpdateMSA = ({ components, data }) => function updateMSA() {
  const msa = this.get('msa');
  const years = this.get('years');

  updateTractData({
    msa,
    years,
    data,
    updateComponents() {
      const {
        msaAtlas,
      } = components;

      const cachedTractGeoJSON = data.get('cachedTractGeoJSON');

      const tractGeo = cachedTractGeoJSON.get(`${msa.msaId}-${years[0]}-${years[1]}`);
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
