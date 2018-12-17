const getStateUpdateYear = ({ components }) => function updateYears() {
  const {
    atlas,
    sliderDropdown,
    histogram,
    sidebar,
    msaAtlas,
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
      years,
    })
    .updateYears();

  histogram
    .config({
      nationalMapData,
      years,
    });
  if (scale === 'national') {
    histogram.updateData();
  }


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

  this.getCurrentTractGeo((tractGeo) => {
    msaAtlas
      .config({
        tractGeo,
      })
      .updateData();

    histogram
      .config({
        tractGeo,
      })
      .updateData();
  });
};

export default getStateUpdateYear;
