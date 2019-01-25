import Histogram from '../histogram/histogram';
import exportMethods from '../export/exportMethods';

const getHistogram = ({ data, state }) => new Histogram({
  mobileHistogramOpen: state.get('mobileHistogramOpen'),
  changeColorScale: data.get('changeColorScale'),
  container: state.get('mobile') ? d3.select('.histogram-mobile') : d3.select('.histogram'),
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
  updateHighlightedTracts: (newHighlight) => {
    state.update({ highlightedTracts: newHighlight });
  },
  currentScale: state.get('scale'),
  currentCensusField: state.get('censusField'),
  distanceFilter: state.get('distanceFilter'),
  years: state.get('years'),
  legendOn: state.get('scale') === 'national',
  exportMethods,
  mobile: state.get('mobile'),
});

export default getHistogram;
