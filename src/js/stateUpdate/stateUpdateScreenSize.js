const getStateUpdateScreenSize = ({ components }) => function updateScreenSize() {
  const {
    histogram,
    sidebar,
    atlas,
  } = components;
  [
    histogram,
    sidebar,
    atlas,
  ].forEach((component) => {
    if (component !== null && component !== undefined) {
      component.updateSize();
    }
  });
};

export default getStateUpdateScreenSize;
