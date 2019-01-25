import State from '../state/state';
import getGetCurrentTractGeo from '../stateMethods/stateGetCurrentTractGeoJSON';
import getGetCurrentIndicatorSummaries from '../stateMethods/stateGetCurrentIndicatorSummaries';
import getGetAllAgenciesForCurrentMSA from '../stateMethods/stateGetAllMSAAgencies';
import getGetCurrentAgenciesData from '../stateMethods/stateGetCurrentAgenciesData';
import getGetCurrentNationalMapData from '../stateMethods/stateGetCurrentNationalMapData';
import getGetCurrentNationalData from '../stateMethods/stateGetCurrentNationalData';

const getState = ({ data }) => {
  const state = new State({
    sidebarView: 'sparkLines',
    mobileSidebarOpen: false,
    mobileHistogramOpen: false,
    mobile: window.matchMedia('(max-width: 700px), (max-device-width: 823px) and (orientation: landscape), (max-device-height: 823px) and (orientation: portrait)').matches,
    msa: null, // for msa view
    msaProbe: null, // probed msa in national view
    indicator: data.get('indicators').get('upt'),
    // years: data.get('yearRange'),
    years: [2008, 2015],
    agenciesOn: true,
    nationalDataView: 'ta', // ta or msa
    scale: 'national', // national or msa,
    censusField: { text: 'Median Household Income', value: 'income' },
    distanceFilter: null,
    highlightedAgencies: [], // agencies highlighted on map/histogram/chart(s) mouseover,
    highlightedTracts: [], // tracts highlighted on map/histogram/chart mouseover
    expandedIndicator: null,
    comparedAgencies: [],
    compareMode: false,
    searchResult: null,
    taFilter: new Set(), // agencies to filter out in msa-scale map and charts
    screenSize: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    currentZoom: null,
    msaScaleExtent: [8, 15],
  });

  Object.assign(
    state,
    {
      getCurrentTractGeo: getGetCurrentTractGeo({ data }),
      getCurrentNationalMapData: getGetCurrentNationalMapData({ data }),
      getCurrentAgenciesData: getGetCurrentAgenciesData({ data }),
      getCurrentIndicatorSummaries: getGetCurrentIndicatorSummaries({ data }),
      getAllAgenciesForCurrentMSA: getGetAllAgenciesForCurrentMSA({ data }),
      getCurrentNationalData: getGetCurrentNationalData({ data }),
    },
  );

  return state;
};

export default getState;
