import Atlas from '../atlas/atlas';

const getAtlas = ({ data, state }) => new Atlas({
  statesTopo: data.get('statesTopo'),
  currentNationalMapData: state.getCurrentNationalMapData(),
});

export default getAtlas;
