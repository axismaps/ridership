import getStateUpdateYears from './stateUpdateYears';
import getStateUpdateIndicator from './stateUpdateIndicator';
import getStateUpdateScale from './stateUpdateScale';
import getStateUpdateHighlightedAgencies from './stateUpdateHighlightedAgencies';
import getStateUpdateComparedAgencies from './stateUpdateComparedAgencies';
import getStateUpdateExpandedIndicator from './stateUpdateExpandedIndicator';
import getStateUpdateMSA from './stateUpdateMSA';
import getStateUpdateCensusField from './stateUpdateCensusField';
import getStateUpdateNationalDataView from './stateUpdateNationalDataView';

const initStateUpdateListeners = ({ components, data }) => {
  const { state } = components;

  state.registerCallbacks({
    years: getStateUpdateYears(({ components, data })),
    indicator: getStateUpdateIndicator({ components }),
    scale: getStateUpdateScale({ components, data }),
    msa: getStateUpdateMSA({ components, data }),
    highlightedAgencies: getStateUpdateHighlightedAgencies({ components }),
    expandedIndicator: getStateUpdateExpandedIndicator({ components }),
    comparedAgencies: getStateUpdateComparedAgencies({ components }),
    censusField: getStateUpdateCensusField({ components, data }),
    nationalDataView: getStateUpdateNationalDataView({ components }),
  });
};

export default initStateUpdateListeners;
