import getStateUpdateYears from './stateUpdateYears';
import getStateUpdateIndicator from './stateUpdateIndicator';
import getStateUpdateScale from './stateUpdateScale';
import getStateUpdateHighlightedAgencies from './stateUpdateHighlightedAgencies';
import getStateUpdateExpandedIndicator from './stateUpdateExpandedIndicator';

const initStateUpdateListeners = ({ components, data }) => {
  const { state } = components;

  state.registerCallbacks({
    years: getStateUpdateYears(({ components })),
    indicator: getStateUpdateIndicator({ components }),
    scale: getStateUpdateScale({ components, data }),
    highlightedAgencies: getStateUpdateHighlightedAgencies({ components }),
    expandedIndicator: getStateUpdateExpandedIndicator({ components }),
  });
};

export default initStateUpdateListeners;
