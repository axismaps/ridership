import { isArray } from 'util';
import State from '../state/state';
import getGetCurrentTractGeo from '../stateMethods/stateGetCurrentTractGeoJSON';
import getGetCurrentIndicatorSummaries from '../stateMethods/stateGetCurrentIndicatorSummaries';
import getGetAllAgenciesForCurrentMSA from '../stateMethods/stateGetAllMSAAgencies';
import getGetCurrentAgenciesData from '../stateMethods/stateGetCurrentAgenciesData';
import getGetCurrentNationalMapData from '../stateMethods/stateGetCurrentNationalMapData';
import getGetCurrentNationalData from '../stateMethods/stateGetCurrentNationalData';

const defaultYears = [2008, 2015];

const getEmbedOverrideProps = ({ data }) => {
  const embedOverrideProps = {};

  const params = data.get('params');
  const embedded = params.has('embed');
  if (!embedded) return {};

  embedOverrideProps.embedded = embedded;

  if (params.has('sidebarView')) {
    const sidebarView = params.get('sidebarView');
    Object.assign(embedOverrideProps, {
      sidebarView: sidebarView === 'sparklines' ? 'sparkLines' : sidebarView,
    });
  }
  if (params.has('years')) {
    const years = params.get('years')
      .split('|')
      .map(d => Math.Number(d));
    if (isArray(years)
      && years.length === 2
      && years.every(d => d >= defaultYears[0] && d <= defaultYears[1])) {
      Object.assign(embedOverrideProps, { years });
    }
  }

  if (params.has('dropdownsOn')) {
    Object.assign(embedOverrideProps, {
      embedDropdownsOn: params.get('dropdownsOn'),
    });
  }

  Object.assign(embedOverrideProps, {
    embedded,
  });

  console.log('override', embedOverrideProps);

  return embedOverrideProps;
};

const getState = ({ data }) => {
  const defaultStateProps = {
    embedded: false,
    // embedDropdownsOn: true,
    sidebarView: 'sparkLines',
    mobileSidebarOpen: false,
    mobileHistogramOpen: false,
    mobile: window.matchMedia('(max-width: 700px), (max-device-width: 823px) and (orientation: landscape), (max-device-height: 823px) and (orientation: portrait)').matches,
    msa: null, // for msa view
    msaProbe: null, // probed msa in national view
    indicator: data.get('indicators').get('upt'),
    // years: data.get('yearRange'),
    years: defaultYears,
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
  };
  const embedOverrideProps = getEmbedOverrideProps({ data });

  const state = new State(Object.assign(defaultStateProps, embedOverrideProps));

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
