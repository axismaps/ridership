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
    const nationalMapData = data.get('nationalMapData');
    const year = this.get('year');
    return nationalMapData.map((msa) => {
      const msaCopy = Object.assign({}, msa);
      msaCopy.ta = msa.ta.map((agency) => {
        const agencyCopy = Object.assign({}, agency);
        agencyCopy.ntd = agency.ntd.find(d => d.year === year);
        return agencyCopy;
      })
        .filter(agency => agency.ntd !== undefined);
      return msaCopy;
    })
      .filter(msa => msa.ta.length > 0);
  };
  return state;
};

export default getState;
