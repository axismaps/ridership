const getStateUpdateScreenSize = ({ components }) => function updateScreenSize() {
  const {
    histogram,
    sidebar,
  } = components;
  histogram.updateSize();
  sidebar.updateSize();
};

export default getStateUpdateScreenSize;
