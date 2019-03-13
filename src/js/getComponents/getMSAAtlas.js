import MSAAtlas from '../msaAtlas/msaAtlas';

const getMSAAtlas = ({ state, data, tractGeo }) => new MSAAtlas({
  mobile: state.get('mobile'),
  tractGeo,
  scale: state.get('scale'),
  msa: state.get('msa'),
  msaList: data.get('msa'),
  bounds: state.get('bounds'), // for embedded maps
  msaMapContainer: d3.select('.atlas__msa-map-container'),
  atlasOuterContainer: d3.select('.atlas__outer-container'),
  currentCensusField: state.get('censusField'),
  distanceFilter: state.get('distanceFilter'),
  // agenciesData: state.getCurrentAgenciesData(),
  currentAgencies: state.getAllAgenciesForCurrentMSA(),
  taFilter: state.get('taFilter'),
  years: state.get('years'),
  onZoom(newZoom) {
    state.update({ currentZoom: newZoom });
  },
  setMinScale(newMinScale) {
    const currentScaleExtent = state.get('msaScaleExtent');
    const newExtent = [newMinScale, currentScaleExtent[1]];
    state.update({ msaScaleExtent: newExtent });
  },
  updateStateHighlightedTracts(highlightedTracts) {
    state.update({
      highlightedTracts,
    });
  },
  // scaleExtent: data.get('scaleExtent').msa,
});

export default getMSAAtlas;
