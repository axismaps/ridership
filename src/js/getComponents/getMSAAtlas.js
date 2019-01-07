import MSAAtlas from '../msaAtlas/msaAtlas';

const getMSAAtlas = ({ state, data }) => new MSAAtlas({
  scale: state.get('scale'),
  msa: state.get('msa'),
  msaList: data.get('msa'),
  msaMapContainer: d3.select('.atlas__msa-map-container'),
  currentCensusField: state.get('censusField'),
  distanceFilter: state.get('distanceFilter'),
  agenciesData: state.getCurrentAgenciesData(),
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
  // scaleExtent: data.get('scaleExtent').msa,
});

export default getMSAAtlas;
