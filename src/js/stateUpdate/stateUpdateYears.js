import updateTractData from '../data/dataTractMethods';

const getStateUpdateYear = ({ components, data }) => function updateYears() {
  const {
    atlas,
    sliderDropdown,
    histogram,
    sidebar,
  } = components;
  const years = this.get('years');
  const msa = this.get('msa');
  const scale = this.get('scale');
  // const nationalMapData = data.get('nationalMapData');
  // console.log('update years', years);
  const nationalMapData = this.getCurrentNationalMapData();
  const agenciesData = this.getCurrentAgenciesData();

  atlas
    .config({
      nationalMapData,
    })
    .updateYears();

  histogram
    .config({
      nationalMapData,
    })
    .updateData();

  sliderDropdown
    .config({
      years,
    })
    .updateYears();

  sidebar
    .config({
      agenciesData,
      years,
    })
    .updateYears()
    .updateData();

  if (msa === null || scale === 'national') return;
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
        .updateData();
    },
  });
};

export default getStateUpdateYear;
