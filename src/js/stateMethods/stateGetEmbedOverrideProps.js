const getEmbedOverrideProps = ({ data }) => {
  const embedOverrideProps = {};
  const defaultYears = data.get('defaultYears');

  const params = data.get('params');
  const embedded = params.has('embed');
  if (!embedded) return {};

  embedOverrideProps.embedded = embedded;

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

  if (params.has('dropdownsOn')) {
    Object.assign(embedOverrideProps, {
      embedDropdownsOn: params.get('dropdownsOn'),
    });
  }

  if (params.get('embed') === 'msaAtlas'
    || params.get('scale') === 'msa') {
    const msaId = params.get('msa');
    const censusFieldValue = params.get('censusField');
    if (msaId !== undefined
        && censusFieldValue !== undefined) {
      const msa = data.get('msa')
        .find(d => d.msaId === msaId);
      const censusField = data.get('censusFields')
        .find(d => d.value === censusFieldValue);

      Object.assign(embedOverrideProps, {
        scale: 'msa',
        msa,
        censusField,
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

  console.log('override', embedOverrideProps);

  return embedOverrideProps;
};

export default getEmbedOverrideProps;
