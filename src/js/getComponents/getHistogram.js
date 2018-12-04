import Histogram from '../histogram/histogram';

const getHistogram = ({ data, state }) => new Histogram({
  changeColorScale: data.get('changeColorScale'),
  container: d3.select('.histogram'),
  nationalMapData: state.getCurrentNationalMapData(),
  currentIndicator: state.get('indicator'),
  msaProbe: state.get('msaProbe'),
  updateHighlightedAgencies: (newHighlight) => {
    const highlights = newHighlight || [];
    state.update({ highlightedAgencies: highlights });
  },
});

export default getHistogram;
