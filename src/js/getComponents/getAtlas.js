import Atlas from '../atlas/atlas';

const getAtlas = ({ data, state }) => new Atlas({
  statesTopo: data.get('statesTopo'),
  currentNationalMapData: state.getCurrentNationalMapData(),
  indicator: state.get('indicator'),
  msa: state.get('msa'),
});

export default getAtlas;
