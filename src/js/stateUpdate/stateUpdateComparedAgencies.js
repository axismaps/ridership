const getStateUpdateHighlightedAgencies = ({ components }) => function updateHighlightedAgencies() {
  const {
    atlas,
    histogram,
    sidebar,
  } = components;

  const comparedAgencies = this.get('comparedgencies');

  atlas
    .config({
      comparedAgencies,
    });

  histogram
    .config({
      comparedAgencies,
    });

  sidebar
    .config({
      comparedAgencies,
    })
    .updateData();
};

export default getStateUpdateHighlightedAgencies;
