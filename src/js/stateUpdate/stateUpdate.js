import getStateUpdateYear from './stateUpdateYear';

const setStateCallbacks = ({ components }) => {
  const { state } = components;

  state.registerCallbacks({
    year: getStateUpdateYear(({ components })),
  });
};

export default setStateCallbacks;
