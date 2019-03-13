const getEmbedOverrideProps = ({ data }) => {
  const embedOverrideProps = {};
  const defaultYears = data.get('defaultYears');

  const params = data.get('params');
  const embedded = params.has('embed');
  const embed = params.get('embed');
  if (!embedded) return {};

  Object.assign(embedOverrideProps, {
    embedded,
    embed,
    mobile: false,
  });

  if (params.has('sidebarView')) {
    const sidebarView = params.get('sidebarView');
    Object.assign(embedOverrideProps, {
      sidebarView: sidebarView === 'sparklines' ? 'sparkLines' : sidebarView,
    });
  }
  // expand sparklines
  if (params.has('expanded')) {
    Object.assign(embedOverrideProps, { expandedSparklines: true });
  }
  if (params.has('years')) {
    const years = params.get('years')
      .split('|')
      .map(d => +d);
    if (Array.isArray(years)
      && years.length === 2
      && years.every(d => d >= defaultYears[0] && d <= defaultYears[1])) {
      Object.assign(embedOverrideProps, { years });
    }
  }


  /**
   * process indicator param
   */
  if (params.has('indicator')) {
    const indicatorValue = params.get('indicator');
    const indicatorList = data.get('indicators');
    const scale = params.get('scale');

    if (embed === 'sidebar') {
      const indicatorValues = indicatorValue.split('|');

      const newIndicatorList = new Map();

      indicatorValues.forEach((value) => {
        newIndicatorList.set(value, indicatorList.get(value));
      });

      data.set('indicators', newIndicatorList);
      Object.assign(embedOverrideProps, {
        indicator: null,
      });
    } else if (embed === 'atlas' || (embed === 'histogram' && scale === 'national')) {
      Object.assign(embedOverrideProps, {
        indicator: indicatorList.get(indicatorValue),
      });
    } else if (embed === 'msaAtlas' || (embed === 'histogram' && scale === 'msa')) {
      Object.assign(embedOverrideProps, {
        censusField: data.get('censusFields')
          .find(d => d.value === indicatorValue),
      });
    }
  }

  if (params.has('selected')) {
    const selected = data.get('indicators').get(params.get('selected'));
    Object.assign(embedOverrideProps, { selected });
  }

  if (params.has('nationalDataView')) {
    Object.assign(embedOverrideProps, {
      nationalDataView: params.get('nationalDataView'),
    });
  }

  if (params.get('compared')) {
    const ids = params.get('compared').split('|');
    const nationalMapData = data.get('allNationalMapData');
    const tas = nationalMapData.map(msa => msa.ta)
      .reduce((accumulator, ta) => [...accumulator, ...ta], [])
      .filter(ta => ids.includes(ta.taId));
    const msas = nationalMapData.filter(ta => ids.includes(ta.msaId));
    const comparedAgencies = tas.length ? tas : msas;
    Object.assign(embedOverrideProps, {
      comparedAgencies,
    });
  }

  if (params.get('distanceFilter')) {
    const distanceFilter = +params.get('distanceFilter');
    Object.assign(embedOverrideProps, {
      distanceFilter: data.get('distanceFilters').find(d => d.value === distanceFilter),
    });
  }


  /**
   * msa-scale embeds
   * @private
   */
  if (embed === 'msaAtlas'
    || params.get('scale') === 'msa') {
    const msaId = params.get('msa');

    if (msaId !== undefined) {
      const msa = data.get('msa')
        .find(d => d.msaId === msaId);

      Object.assign(embedOverrideProps, {
        scale: 'msa',
        msa,
      });
      if (!params.has('years')) {
        Object.assign(embedOverrideProps, {
          years: data.get('msaYearRange'),
        });
      }
    }
  }


  return embedOverrideProps;
};

export default getEmbedOverrideProps;
