import getStateUpdateYears from './stateUpdateYears';
import getStateUpdateIndicator from './stateUpdateIndicator';
import getStateUpdateScale from './stateUpdateScale';
import getStateUpdateHighlightedAgencies from './stateUpdateHighlightedAgencies';

const initStateUpdateListeners = ({ components, data }) => {
  const { state } = components;

  state.registerCallbacks({
    years: getStateUpdateYears(({ components })),
    indicator: getStateUpdateIndicator({ components }),
    scale: getStateUpdateScale({ components, data }),
    highlightedAgencies: getStateUpdateHighlightedAgencies({ components, data }),
  });
};

export default initStateUpdateListeners;
