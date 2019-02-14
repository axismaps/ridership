const getUpdateHighlightedTracts = ({ components }) => function updateHighlightedTracts() {
  const {
    msaAtlas,
    histogram,
  } = components;

  const highlightedTracts = this.get('highlightedTracts');

  console.log('highlightedTracts', highlightedTracts);
  msaAtlas
    .config({
      highlightedTracts,
    })
    .updateHighlightedTracts();

  histogram
    .config({
      highlightedTracts,
    })
    .updateHighlightedTracts();
};

export default getUpdateHighlightedTracts;
