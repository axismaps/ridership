const getStateUpdateScreenSize = ({ components }) => function updateScreenSize() {
  const {
    histogram,
    sidebar,
    atlas,
  } = components;
  histogram.updateSize();
  sidebar.updateSize();
  atlas.updateSize();
};

export default getStateUpdateScreenSize;
