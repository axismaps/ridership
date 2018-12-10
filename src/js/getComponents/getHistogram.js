import Histogram from '../histogram/histogram';

const getHistogram = ({ data, state }) => new Histogram({
  changeColorScale: data.get('changeColorScale'),
  container: d3.select('.histogram'),
  nationalMapData: state.getCurrentNationalMapData(),
  nationalDataView: state.get('nationalDataView'),
  currentIndicator: state.get('indicator'),
  msaProbe: state.get('msaProbe'),
  updateHighlightedAgencies: (newHighlight) => {
    const highlights = newHighlight || [];
    state.update({ highlightedAgencies: highlights });
  },
  currentScale: state.get('scale'),
  currentCensusField: state.get('censusField'),
});

export default getHistogram;
