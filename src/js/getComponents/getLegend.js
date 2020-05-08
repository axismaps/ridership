import Legend from '../legend/legend';
import exportMethods from '../export/exportMethods';

const getLegend = ({ state, data }) => new Legend({
  legendOn: state.get('scale') === 'national' && !state.get('embedded'),
  container: d3.select('.footer__atlas-legend'),
  exportMethods,
  nationalMapData: state.getCurrentNationalMapData(),
  indicator: state.get('indicator'),
});

export default getLegend;
