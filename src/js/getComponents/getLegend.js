import Legend from '../legend/legend';

const getLegend = ({ state, data }) => new Legend({
  legendOn: state.get('scale') === 'national',
  container: d3.select('.footer__atlas-legend'),
  radiusScale: data.get('radiusScale'),
});

export default getLegend;
