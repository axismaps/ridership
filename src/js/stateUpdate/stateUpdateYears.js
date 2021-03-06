const getStateUpdateYear = ({ components }) => function updateYears() {
  const {
    atlas,
    sliderDropdown,
    histogram,
    sidebar,
    msaAtlas,
    yearDropdown,
    legend,
  } = components;
  const years = this.get('years');
  const msa = this.get('msa');
  const scale = this.get('scale');
  const censusField = this.get('censusField');
  // const nationalMapData = data.get('nationalMapData');
  // console.log('update years', years);
  const nationalMapData = this.getCurrentNationalMapData();
  const nationalData = this.getCurrentNationalData();
  const agenciesData = this.getCurrentAgenciesData();

  if (scale === 'msa' && !censusField.change && typeof ga !== 'undefined') {
    // send single year for single year census data
    ga('send', 'event', 'data', 'years', years[1]);
  } else if (typeof ga !== 'undefined') {
    ga('send', 'event', 'data', 'years', years.join('-'));
  }


  atlas
    .config({
      nationalMapData,
      years,
    })
    .updateNationalMapData()
    .updateInteractions();

  legend.config({
    nationalMapData,
    years,
  }).update();

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

  this.getCurrentTractGeo((tractGeo, regionCensus) => {
    msaAtlas
      .config({
        tractGeo,
      })
      .updateData();
    if (histogram !== null) {
      histogram
        .config({
          tractGeo,
          regionCensus,
        })
        .updateData();
    }
  });
};

export default getStateUpdateYear;
