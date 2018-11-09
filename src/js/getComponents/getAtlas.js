import Atlas from '../atlas/atlas';

const getAtlas = ({ data }) => new Atlas({
  statesTopo: data.get('statesTopo'),
});

export default getAtlas;
