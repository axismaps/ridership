import State from '../state/state';

const getState = () => {
  const state = new State({
    mobile: false,
    currentMSA: null,
    currentIndicator: null,
    currentYears: [2016, 2017],
    agenciesOn: true,
  });
  return state;
};

export default getState;
