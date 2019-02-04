const getEmbedOverrideProps = ({ data }) => {
  const embedOverrideProps = {};
  const defaultYears = data.get('defaultYears');

  const params = data.get('params');
  const embedded = params.has('embed');
  const embed = params.get('embed');
  if (!embedded) return {};

  embedOverrideProps.embedded = embedded;

  embedOverrideProps.mobile = false;

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

  if (params.has('indicator')) {
    const indicatorValue = params.get('indicator');
    const indicatorList = data.get('indicators');

    if (embed === 'sidebar') {
      // override data.indicators here
      const indicatorValues = indicatorValue.split('|');
      // const newIndicatorList = indicatorList.filter(d => indicatorValues.includes(d.value));
      const newIndicatorList = new Map();

      indicatorValues.forEach((value) => {
        newIndicatorList.set(value, indicatorList.get(value));
      });

      data.set('indicators', newIndicatorList);
    } else if (embed === 'atlas') {
      Object.assign(embedOverrideProps, {
        indicator: indicatorList.get(indicatorValue),
      });
    } else if (embed === 'msaAtlas') {
      Object.assign(embedOverrideProps, {
        censusField: data.get('censusFields')
          .find(d => d.value === indicatorValue),
      });
    }
  }

  if (embed === 'msaAtlas'
    || params.get('scale') === 'msa') {
    const msaId = params.get('msa');
    // const censusFieldValue = params.get('indicator');
    if (msaId !== undefined) {
      const msa = data.get('msa')
        .find(d => d.msaId === msaId);
      // const censusField = data.get('censusFields')
      //   .find(d => d.value === censusFieldValue);

      Object.assign(embedOverrideProps, {
        scale: 'msa',
        msa,
        // censusField,
      });
      if (!params.has('years')) {
        Object.assign(embedOverrideProps, {
          years: data.get('msaYearRange'),
        });
      }
    }
  }

  Object.assign(embedOverrideProps, {
    embedded,
  });


  return embedOverrideProps;
};

export default getEmbedOverrideProps;
