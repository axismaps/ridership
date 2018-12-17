import getStateUpdateYears from './stateUpdateYears';
import getStateUpdateIndicator from './stateUpdateIndicator';
import getStateUpdateScale from './stateUpdateScale';
import getStateUpdateHighlightedAgencies from './stateUpdateHighlightedAgencies';
import getStateUpdateComparedAgencies from './stateUpdateComparedAgencies';
import getStateUpdateCompareMode from './stateUpdateCompareMode';
import getStateUpdateSearchResult from './stateUpdateSearchResult';
import getStateUpdateExpandedIndicator from './stateUpdateExpandedIndicator';
import getStateUpdateMSA from './stateUpdateMSA';
import getStateUpdateCensusField from './stateUpdateCensusField';
import getStateUpdateDistanceFilter from './stateUpdateDistanceFilter';
import getStateUpdateNationalDataView from './stateUpdateNationalDataView';
import getStateUpdateTAFilter from './stateUpdateTAFilter';

const initStateUpdateListeners = ({ components, data }) => {
  const { state } = components;

  state.registerCallbacks({
    years: getStateUpdateYears(({ components, data })),
    indicator: getStateUpdateIndicator({ components, data }),
    scale: getStateUpdateScale({ components, data }),
    msa: getStateUpdateMSA({ components, data }),
    highlightedAgencies: getStateUpdateHighlightedAgencies({ components, data }),
    expandedIndicator: getStateUpdateExpandedIndicator({ components, data }),
    comparedAgencies: getStateUpdateComparedAgencies({ components, data }),
    compareMode: getStateUpdateCompareMode({ components }),
    searchResult: getStateUpdateSearchResult({ components }),
    censusField: getStateUpdateCensusField({ components, data }),
    distanceFilter: getStateUpdateDistanceFilter({ components, data }),
    nationalDataView: getStateUpdateNationalDataView({ components }),
    taFilter: getStateUpdateTAFilter({ components, data }),
  });
};

export default initStateUpdateListeners;
