import Histogram from '../histogram/histogram';
import exportMethods from '../export/exportMethods';

const getHistogram = ({ data, state, tractGeo }) => {
  const params = data.get('params');

  const embed = params.get('embed');
  if (params.get('histogramOff') === 'true'
  || (embed !== 'histogram' && embed !== 'atlas' && embed !== 'msaAtlas' && state.get('embedded'))) return null;
  return new Histogram({
    tractGeo,
    mobileHistogramOpen: state.get('mobileHistogramOpen'),
    changeColorScale: data.get('changeColorScale'),
    valueColorScale: data.get('valueColorScale'),
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
    updateHighlightedTracts: (newHighlight) => {
      state.update({ highlightedTracts: newHighlight });
    },
    currentScale: state.get('scale'),
    currentCensusField: state.get('censusField'),
    distanceFilter: state.get('distanceFilter'),
    years: state.get('years'),
    legendOn: state.get('scale') === 'national' && params.get('embed') !== 'histogram' && !state.get('embedded'),
    exportMethods,
    mobile: state.get('mobile'),
  });
};

export default getHistogram;
