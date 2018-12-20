import Legend from '../legend/legend';

const getLegend = ({ state }) => new Legend({
  legendOn: state.get('scale') === 'national',
  container: d3.select('.footer__atlas-legend'),
});

export default getLegend;
