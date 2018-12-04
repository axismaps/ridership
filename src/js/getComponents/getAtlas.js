import Atlas from '../atlas/atlas';

const getAtlas = ({ data, state }) => new Atlas({
  statesTopo: data.get('statesTopo'),
  nationalMapData: state.getCurrentNationalMapData(),
  // indicator: state.get('indricator'),
  yearRange: data.get('yearRange'),
  scale: state.get('scale'),
  msa: state.get('msa'),
  changeColorScale: data.get('changeColorScale'),
  jumpToMsa: (agency) => {
    const msa = data.get('msa')
      .find(d => d.msaId === agency.msaId);

    state.update({
      msa,
      scale: 'msa',
    });
  },
  updateHighlightedAgencies: (newHighlight) => {
    const highlights = newHighlight || [];
    state.update({ highlightedAgencies: highlights });
  },
});

export default getAtlas;
