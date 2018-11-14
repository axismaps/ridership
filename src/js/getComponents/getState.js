import State from '../state/state';

const getState = ({ data }) => {
  const state = new State({
    mobile: false,
    msa: null,
    indicator: 'bus',
    // currentYears: [2016, 2017],
    year: 2010,
    agenciesOn: true,
  });

  state.getCurrentNationalMapData = function getCurrentNationalMapData() {
    const nationalMapData = data.get('allNationalMapData');
    const year = this.get('year');
    const indicator = this.get('indicator');
    return nationalMapData.map((msa) => {
      const msaCopy = Object.assign({}, msa);
      msaCopy.ta = msa.ta
        .filter(agency => agency.ntd.find(d => d.year === year) !== undefined)
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
          const ntdRecord = agency.ntd.find(d => d.year === year);
          Object.assign(agencyCopy, ntdRecord);
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
