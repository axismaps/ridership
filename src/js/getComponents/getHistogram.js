import Histogram from '../histogram/histogram';
import exportMethods from '../export/exportMethods';

const getHistogram = ({ data, state }) => new Histogram({
  changeColorScale: data.get('changeColorScale'),
  container: d3.select('.histogram'),
  nationalMapData: state.getCurrentNationalMapData(),
  nationalData: state.getCurrentNationalData(),
  nationalDataView: state.get('nationalDataView'),
  nationalNtd: data.get('nationalNtd'),
  currentIndicator: state.get('indicator'),
  msaProbe: state.get('msaProbe'),
  updateHighlightedAgencies: (newHighlight) => {
    const highlights = newHighlight || [];
    state.update({ highlightedAgencies: highlights });
  },
  currentScale: state.get('scale'),
  currentCensusField: state.get('censusField'),
  distanceFilter: state.get('distanceFilter'),
  years: state.get('years'),
  legendOn: state.get('scale') === 'national',
  exportMethods,
});

export default getHistogram;
