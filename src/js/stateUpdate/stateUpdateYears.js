import getCurrentTractData from '../data/dataTractMethods';

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
  const censusField = this.get('censusField');

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

  const distanceFilter = this.get('distanceFilter');

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
        .updateData();
    },
  });
};

export default getStateUpdateYear;
