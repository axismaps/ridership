import Atlas from '../atlas/atlas';
import exportMethods from '../export/exportMethods';

const getAtlas = ({ data, state }) => new Atlas({
  mapContainer: d3.select('.atlas__map-container'),
  statesTopo: data.get('statesTopo'),
  nationalMapData: state.getCurrentNationalMapData(),
  allNationalMapData: data.get('allNationalMapData'),
  indicator: state.get('indicator'),
  yearRange: data.get('yearRange'),
  scale: state.get('scale'),
  msa: state.get('msa'),
  changeColorScale: data.get('changeColorScale'),
  nationalDataView: state.get('nationalDataView'),
  compareMode: state.get('compareMode'),
  comparedAgencies: state.get('comparedAgencies'),
  years: state.get('years'),
  radiusScale: data.get('radiusScale'),
  exportMethods,
  jumpToMsa: (agency) => {
    const msa = data.get('msa')
      .find(d => d.msaId === agency.msaId);

    state.update({

      scale: 'msa',
      msa,
      searchResult: null,
      compareMode: false,
      comparedAgencies: [],
    });
  },
  updateHighlightedAgencies: (newHighlight) => {
    const highlights = newHighlight || [];
    state.update({ highlightedAgencies: highlights });
  },
  updateComparedAgencies: (comparedAgencies) => {
    state.update({ comparedAgencies });
  },
  onZoom(newZoom) {
    state.update({ currentZoom: newZoom });
  },
  scaleExtent: data.get('scaleExtent').national,
});

export default getAtlas;
