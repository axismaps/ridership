import State from '../state/state';

const getState = ({ data }) => {
  const state = new State({
    mobile: false,
    msa: null,
    indicator: 'bus',
    // currentYears: [2016, 2017],
    years: [2008, 2010],
    agenciesOn: true,
    nationalDataView: 'ta', // ta or msa
    scale: 'national', // national or msa
  });

  state.getCurrentNationalMapData = function getCurrentNationalMapData() {
    const nationalMapData = data.get('allNationalMapData');
    const years = this.get('years');

    const indicator = this.get('indicator');
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

          const ntdRecords = agency.ntd.filter(inYears);
          const yearExtent = d3.extent(agency.ntd, d => d.year);

          const firstRecord = agency.ntd.find(d => d.year === yearExtent[0])[indicator];
          const lastRecord = agency.ntd.find(d => d.year === yearExtent[1])[indicator];

          const noRecord = d => [0, null].includes(d);

          const pctChange = noRecord(firstRecord)
            ? null
            : ((lastRecord - firstRecord)
              / firstRecord) * 100;
          const indicatorValue = d3.sum(ntdRecords, d => d[indicator]);
          // Object.assign(agencyCopy, ntdRecords);
          Object.assign(agencyCopy, {
            indicator: indicatorValue,
            pctChange,
          });
          return agencyCopy;
        })
        .filter(agency => agency[indicator] !== 0);
      return msaCopy;
    })
      .filter(msa => msa.ta.length > 0);
  };
  return state;
};

export default getState;
