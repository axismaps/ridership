const getNationalIndicatorSummaries = function getNationalIndicatorSummaries({ data }) {
  const comparedAgencies = this.get('comparedAgencies');
  const yearRange = data.get('yearRange');
  const indicators = data.get('indicators');
  const indicatorSummaries = [];
  if (comparedAgencies.length === 0) {
    const records = data.get('nationalNtd');
    indicators.forEach((indicator, key) => {
      const indicatorCopy = Object.assign({}, indicator);
      const summaries = records.map((record) => {
        const {
          year,
        } = record;

        const indicatorSummary = record[key];

        return { year, indicatorSummary };
      })
        .filter(s => s.indicatorSummary !== null);
      const mean = d3.mean(summaries, s => s.indicatorSummary);
      const stDev = d3.deviation(summaries, s => s.indicatorSummary);
      const scale = stDev === undefined ? undefined : value => (value - mean) / stDev;
      indicatorCopy.agencies = [{
        taId: 'all',
        msaId: 'all',
        globalId: 'all',
        summaries,
        scale,
        mean,
        stDev,
      }];

      indicatorSummaries.push(indicatorCopy);
    });
    return indicatorSummaries;
  }
  const nationalDataView = this.get('nationalDataView');
  const allNationalMapData = data.get('allNationalMapData');
  const taRecords = allNationalMapData.map((msa) => {
    const msaRecords = msa.ta.map(ta => ta.ntd)
      .reduce((accumulator, ta) => [...accumulator, ...ta], []);
    return msaRecords;
  })
    .reduce((accumulator, msa) => [...accumulator, ...msa], []);
  const msaRecords = allNationalMapData.map(msa => msa.ntd)
    .reduce((accumulator, msa) => [...accumulator, ...msa], []);
  const idField = `${nationalDataView}Id`;
  const ids = comparedAgencies.map(d => d[idField]);
  const records = (nationalDataView === 'ta' ? taRecords : msaRecords)
    .filter(d => ids.includes(d[idField]));
  indicators.forEach((indicator, key) => {
    const indicatorCopy = Object.assign({}, indicator);
    indicatorCopy.agencies = [];
    const agencies = comparedAgencies.map(a => Object.assign({ summaries: [] }, a));
    agencies.forEach((agency) => {
      for (let i = 0; i <= yearRange[1] - yearRange[0]; i += 1) {
        const year = yearRange[0] + i;
        const record = records
          .find(d => d[idField] === agency[idField]
            && d.year === year
            && d[key] !== null
            && Number.isFinite(d[key]));
        if (record !== undefined) {
          const summary = {
            year,
            indicatorSummary: record[key],
          };
          agency.summaries.push(summary);
        }
      }
      const mean = d3.mean(agency.summaries, s => s.indicatorSummary);
      const stDev = d3.deviation(agency.summaries, s => s.indicatorSummary);
      const scale = stDev === undefined ? undefined : value => (value - mean) / stDev;
      Object.assign(agency, {
        mean,
        stDev,
        scale,
      });
      indicatorCopy.agencies.push(agency);
    });

    indicatorSummaries.push(indicatorCopy);
  });
  return indicatorSummaries;
};

const getMSAIndicatorSummaries = function getMSAIndicatorSummaries({ data }) {
  const currentMSA = this.get('msa');
  const currentTAFilter = this.get('taFilter');
  const allNationalMapData = data.get('allNationalMapData');
  const agencies = allNationalMapData.find(d => d.msaId === currentMSA.msaId).ta;


  const indicators = data.get('indicators');


  const indicatorSummaries = [];

  indicators.forEach((indicator, key) => {
    const indicatorCopy = Object.assign({}, indicator);
    const agenciesWithSummaries = agencies
      .filter(agency => !currentTAFilter.has(agency.taId))
      .map((agency) => {
        const agencyCopy = Object.assign({

        }, agency);
        agencyCopy.summaries = agency.ntd
          .map(d => ({
            year: d.year,
            indicatorSummary: d[key],
          }))
          .filter(d => d.indicatorSummary !== null && d.indicatorSummary !== undefined);
        const mean = d3.mean(agencyCopy.summaries, s => s.indicatorSummary);
        const stDev = d3.deviation(agencyCopy.summaries, s => s.indicatorSummary);
        const scale = stDev === undefined ? undefined : value => (value - mean) / stDev;
        Object.assign(agencyCopy, {
          mean,
          stDev,
          scale,
        });
        return agencyCopy;
      });
    indicatorCopy.agencies = agenciesWithSummaries;
    indicatorSummaries.push(indicatorCopy);
  });

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
