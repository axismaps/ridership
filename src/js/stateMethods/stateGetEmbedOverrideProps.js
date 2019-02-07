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
  if (params.has('years')) {
    const years = params.get('years')
      .split('|')
      .map(d => Math.Number(d));
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
