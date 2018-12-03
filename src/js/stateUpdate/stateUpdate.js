import getStateUpdateYears from './stateUpdateYears';
import getStateUpdateIndicator from './stateUpdateIndicator';
import getStateUpdateScale from './stateUpdateScale';

const initStateUpdateListeners = ({ components }) => {
  const { state } = components;

  state.registerCallbacks({
    years: getStateUpdateYears(({ components })),
    indicator: getStateUpdateIndicator({ components }),
    scale: getStateUpdateScale({ components }),
  });
};

export default initStateUpdateListeners;
