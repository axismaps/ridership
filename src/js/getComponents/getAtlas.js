import Atlas from '../atlas/atlas';

const getAtlas = ({ data, state }) => new Atlas({
  statesTopo: data.get('statesTopo'),
  nationalMapData: state.getCurrentNationalMapData(),
  // indicator: state.get('indricator'),
  yearRange: data.get('yearRange'),
  msa: state.get('msa'),
});

export default getAtlas;
