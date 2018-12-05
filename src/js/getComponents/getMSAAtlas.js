import MSAAtlas from '../msaAtlas/msaAtlas';

const getMSAAtlas = ({ state, data }) => new MSAAtlas({
  scale: state.get('scale'),
  msa: state.get('msa'),
  msaList: data.get('msa'),
});

export default getMSAAtlas;
