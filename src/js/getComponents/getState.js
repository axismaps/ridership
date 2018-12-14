import State from '../state/state';
import getGetCurrentTractGeo from '../stateMethods/stateGetCurrentTractGeoJSON';
import getGetCurrentIndicatorSummaries from '../stateMethods/stateGetCurrentIndicatorSummaries';
import getGetAllAgenciesForCurrentMSA from '../stateMethods/stateGetAllMSAAgencies';
import getGetCurrentAgenciesData from '../stateMethods/stateGetCurrentAgenciesData';
import getGetCurrentNationalMapData from '../stateMethods/stateGetCurrentNationalMapData';

const getState = ({ data }) => {
  const state = new State({
    mobile: false,
    msa: null, // for msa view
    msaProbe: null, // probed msa in national view
    indicator: data.get('indicators').get('headways'),
    // years: data.get('yearRange'),
    years: [2013, 2015],
    agenciesOn: true,
    nationalDataView: 'ta', // ta or msa
    scale: 'national', // national or msa,
    censusField: { text: 'Income', value: 'income' },
    distanceFilter: null,
    highlightedAgencies: [], // agencies highlighted on map/histogram/chart(s) mouseover,
    highlightedTracts: [], // tracts highlighted on map/histogram/chart mouseover
    expandedIndicator: null,
    comparedAgencies: [],
    compareMode: false,
    searchResult: null,
    taFilter: new Set(), // agencies to filter out in msa-scale map and charts
  });

  Object.assign(
    state,
    {
      getCurrentTractGeo: getGetCurrentTractGeo({ data }),
      getCurrentNationalMapData: getGetCurrentNationalMapData({ data }),
      getCurrentAgenciesData: getGetCurrentAgenciesData({ data }),
      getCurrentIndicatorSummaries: getGetCurrentIndicatorSummaries({ data }),
      getAllAgenciesForCurrentMSA: getGetAllAgenciesForCurrentMSA({ data }),
    },
  );

  return state;
};

export default getState;
