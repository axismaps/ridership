const getNationalIndicatorSummaries = function getNationalIndicatorSummaries({ data }) {
  const comparedAgencies = this.get('comparedAgencies');
  const nationalDataView = this.get('nationalDataView');
  const ids = comparedAgencies.map(d => d[`${nationalDataView}Id`]);
  const allNationalMapData = data.get('allNationalMapData');
  const records = allNationalMapData.map((msa) => {
    const msaRecords = msa.ta.map(ta => ta.ntd)
      .reduce((accumulator, ta) => [...accumulator, ...ta], []);
    return msaRecords;
  })
    .reduce((accumulator, msa) => [...accumulator, ...msa], [])
    .filter(d => ids.length === 0 || ids.includes(d[`${nationalDataView}Id`]));
  const yearRange = data.get('yearRange');
  const indicators = data.get('indicators');
  const indicatorSummaries = [];
  {
    const recordsPerYear = new Map();
    for (let i = 0; i < yearRange[1] - yearRange[0]; i += 1) {
      const year = yearRange[0] + i;
      const recordsForYear = records.filter(d => d.year === year);
      recordsPerYear.set(year, recordsForYear);
    }
    indicators.forEach((indicator, key) => {
      const indicatorCopy = Object.assign({}, indicator);
      indicatorCopy.agencies = [];
      const agencies = comparedAgencies.length === 0
        ? [{
          taId: 'all',
          msaId: 'all',
          globalId: 'all',
          summaries: [],
        }]
        : comparedAgencies.map(a => Object.assign({ summaries: [] }, a));
      agencies.forEach((agency) => {
        for (let i = 0; i < yearRange[1] - yearRange[0]; i += 1) {
          const year = yearRange[0] + i;
          const recordsForYear = recordsPerYear.get(year)
            .filter(d => d[key] !== null
              && Number.isFinite(d[key])
              && (agency[`${nationalDataView}Id`] === 'all' || agency[`${nationalDataView}Id`] === d[`${nationalDataView}Id`]));
          const indicatorSummary = d3[indicator.summaryType](recordsForYear, d => d[key]);
          const summary = {
            year,
            indicatorSummary,
          };
          if (indicatorSummary !== undefined) {
            agency.summaries.push(summary);
          }
        }
        indicatorCopy.agencies.push(agency);
      });

      indicatorSummaries.push(indicatorCopy);
    });
  }
  console.log('national summaries', indicatorSummaries);
  return indicatorSummaries;
};

const getMSAIndicatorSummaries = function getMSAIndicatorSummaries({ data }) {
  // const largestAgencyColor = '#644497';
  // const colors = [
  //   '#00ad91',
  //   '#ff5e4d',
  //   '#eb52d6',
  //   '#ff9d2e',
  //   '#8c6112',
  //   '#0f8fff',
  //   '#33a02c',
  //   '#c2ab00',
  //   '#707070',
  //   '#bc80bd',
  // ];
  const currentMSA = this.get('msa');
  const allNationalMapData = data.get('allNationalMapData');
  const agencies = allNationalMapData.find(d => d.msaId === currentMSA.msaId).ta;

  // const averageUPTs = agencies.reduce((accumulator, d) => {
  //   accumulator[d.taId] = d3.mean(d.ntd, dd => dd.upt);
  //   return accumulator;
  // }, {});

  // const largestAgency = agencies.reduce((accumulator, d) => {
  //   if (averageUPTs[d.taId] > averageUPTs[accumulator.taId]) {
  //     return d;
  //   }
  //   return accumulator;
  // })
  //   .taId;

  // const agencyColors = agencies.reduce((accumulator, agency, i) => {
  //   if (agency.taId === largestAgency) {
  //     accumulator[agency.taId] = largestAgencyColor;
  //   } else {
  //     accumulator[agency.taId] = colors[i];
  //   }
  //   return accumulator;
  // }, {});
  const indicators = data.get('indicators');

  // console.log('agencyColors', agencyColors);
  const indicatorSummaries = [];

  indicators.forEach((indicator, key) => {
    const indicatorCopy = Object.assign({}, indicator);
    const agenciesWithSummaries = agencies.map((agency) => {
      const agencyCopy = Object.assign({
        // color: agencyColors[agency.taId],
      }, agency);
      agencyCopy.summaries = agency.ntd
        .map(d => ({
          year: d.year,
          indicatorSummary: d[key],
        }))
        .filter(d => d.indicatorSummary !== null && d.indicatorSummary !== undefined);
      return agencyCopy;
    });
    indicatorCopy.agencies = agenciesWithSummaries;
    indicatorSummaries.push(indicatorCopy);
  });
  console.log('msa summaries', indicatorSummaries);
  return indicatorSummaries;
};

const getGetCurrentIndicatorSummaries = ({ data }) => function getIndicatorSummaries() {
  const currentScale = this.get('scale');
  if (currentScale === 'national') {
    return getNationalIndicatorSummaries.call(this, { data });
  }

  return getMSAIndicatorSummaries.call(this, { data });
};

export default getGetCurrentIndicatorSummaries;
