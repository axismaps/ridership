import Atlas from '../atlas/atlas';

const getAtlas = ({ data, state }) => new Atlas({
  mapContainer: d3.select('.atlas__map-container'),
  statesTopo: data.get('statesTopo'),
  nationalMapData: state.getCurrentNationalMapData(),
  // indicator: state.get('indricator'),
  yearRange: data.get('yearRange'),
  scale: state.get('scale'),
  msa: state.get('msa'),
  changeColorScale: data.get('changeColorScale'),
  nationalDataView: state.get('nationalDataView'),
  jumpToMsa: (agency) => {
    const msa = data.get('msa')
      .find(d => d.msaId === agency.msaId);

    state.update({

      scale: 'msa',
      msa,
    });
  },
  updateHighlightedAgencies: (newHighlight) => {
    const highlights = newHighlight || [];
    state.update({ highlightedAgencies: highlights });
  },
});

export default getAtlas;
