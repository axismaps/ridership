const getStateUpdateYear = ({ components }) => function updateYears() {
  const {
    atlas,
    sliderDropdown,
    histogram,
    sidebar,
    msaAtlas,
    yearDropdown,
  } = components;
  const years = this.get('years');
  const msa = this.get('msa');
  const scale = this.get('scale');
  // const nationalMapData = data.get('nationalMapData');
  // console.log('update years', years);
  const nationalMapData = this.getCurrentNationalMapData();
  const nationalData = this.getCurrentNationalData();
  const agenciesData = this.getCurrentAgenciesData();

  atlas
    .config({
      nationalMapData,
      years,
    })
    .updateYears()
    .updateInteractions();

  if (histogram !== null) {
    histogram
      .config({
        nationalMapData,
        years,
        nationalData,
      });
    if (scale === 'national') {
      histogram.updateData();
    }
  }


  sliderDropdown
    .config({
      years,
    })
    .updateYears();

  yearDropdown
    .config({
      years,
    })
    .update();

  sidebar
    .config({
      agenciesData,
      years,
    })
    .updateYears()
    .updateData();

  msaAtlas
    .config({
      years,
    });

  if (msa === null || scale === 'national') return;

  this.getCurrentTractGeo((tractGeo) => {
    msaAtlas
      .config({
        tractGeo,
      })
      .updateData();
    if (histogram !== null) {
      histogram
        .config({
          tractGeo,
        })
        .updateData();
    }
  });
};

export default getStateUpdateYear;
