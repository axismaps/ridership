import MSAAtlas from '../msaAtlas/msaAtlas';

const getMSAAtlas = ({ state, data }) => new MSAAtlas({
  scale: state.get('scale'),
  msa: state.get('msa'),
  msaList: data.get('msa'),
  msaMapContainer: d3.select('.atlas__msa-map-container'),
  currentCensusField: state.get('censusField'),
});

export default getMSAAtlas;
