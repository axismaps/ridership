const getStateUpdateExpandedIndicator = ({ components }) => function updateExpandedIndicator() {
  const {
    sidebar,
  } = components;

  const expandedIndicator = this.get('expandedIndicator');

  sidebar
    .config({
      expandedIndicator,
    })
    .updateExpandedIndicator();
};

export default getStateUpdateExpandedIndicator;
