import State from '../state/state';

const getState = ({ data }) => {
  const state = new State({
    mobile: false,
    msa: null, // for msa view
    msaProbe: null, // probed msa in national view
    indicator: data.get('indicators').get('headways'),
    // years: data.get('yearRange'),
    years: [2013, 2015],
    agenciesOn: true,
    nationalDataView: 'ta', // ta or msa
    scale: 'national', // national or msa,
    highlightedAgencies: [], // agencies highlighted on map/histogram/chart(s) mouseover,
    expandedIndicator: null,
  });

  state.getCurrentNationalMapData = function getCurrentNationalMapData() {
    const nationalMapData = data.get('allNationalMapData');

    const years = this.get('years');

    const indicator = this.get('indicator').value;
    const inYears = d => d.year >= years[0] && d.year <= years[1];

    return nationalMapData.map((msa) => {
      const msaCopy = Object.assign({}, msa);
      msaCopy.ta = msa.ta
        .filter(agency => agency.ntd.filter(inYears).length > 0)
        .map((agency) => {
          const {
            cent,
            msaId,
            taId,
            taName,
            taShort,
          } = agency;
          const agencyCopy = {
            cent,
            msaId,
            taId,
            taName,
            taShort,
          };

          // const ntdRecords = agency.ntd.filter(inYears);
          const ntd2017 = agency.ntd.find(d => d.year === 2017);

          const firstRecord = agency.ntd.find(d => d.year === years[0])[indicator];
          const lastRecord = agency.ntd.find(d => d.year === years[1])[indicator];

          const noRecord = d => [0, null].includes(d);

          const pctChange = noRecord(firstRecord)
            ? null
            : ((lastRecord - firstRecord)
              / firstRecord) * 100;
          // const indicatorValue = d3.sum(ntdRecords, d => d[indicator]);
          // const uptTotal = d3.sum(ntdRecords, d => d.upt);

          Object.assign(agencyCopy, {
            // indicatorValue,
            pctChange,
            // uptTotal,
            upt2017: ntd2017.upt,
            msaName: msa.name,
            taName: agency.taName,
            taShort: agency.taShort,
          });
          return agencyCopy;
        })
        .filter(agency => agency.uptTotal !== 0);
      return msaCopy;
    })
      .filter(msa => msa.ta.length > 0);
  };
  state.getCurrentAllAgenciesData = function getCurrentAllAgenciesData() {
    const nationalMapData = data.get('allNationalMapData');
    const indicatorSummaries = data.get('indicatorSummaries');

    const years = this.get('years');

    const inYears = d => d.year >= years[0] && d.year <= years[1];

    return nationalMapData.map(msa => msa.ta
      .filter(agency => agency.ntd.filter(inYears).length > 0)
      .map((agency) => {
        const {
          msaId,
          taId,
          taName,
          taShort,
        } = agency;
        const agencyCopy = {
          msaId,
          taId,
          taName,
          taShort,
        };
        const agencyIndicators = indicatorSummaries.map((indicator) => {
          const {
            text,
            value,
          } = indicator;
          const indicatorCopy = {
            text,
            value,
          };
          const firstRecord = agency.ntd.find(d => d.year === years[0])[value];
          const lastRecord = agency.ntd.find(d => d.year === years[1])[value];
          const noRecord = d => [null].includes(d);
          const pctChange = noRecord(firstRecord)
            ? null
            : ((lastRecord - firstRecord)
                / firstRecord) * 100;

          Object.assign(indicatorCopy, {
            pctChange,
          });

          return indicatorCopy;
        });
        Object.assign(agencyCopy, {
          indicators: agencyIndicators,
        });
        return agencyCopy;
      }))
      .filter(msa => msa.length > 0)
      .reduce((accumulator, msa) => [...accumulator, ...msa], []);
  };
  return state;
};

export default getState;
