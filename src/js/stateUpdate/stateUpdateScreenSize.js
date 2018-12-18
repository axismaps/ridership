const getStateUpdateScreenSize = ({ components }) => function updateScreenSize() {
  const {
    histogram,
  } = components;
  histogram.updateSize();
};

export default getStateUpdateScreenSize;
