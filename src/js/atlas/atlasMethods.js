const atlasMethods = {
  drawMapSVG({
    mapContainer,
    width,
    height,
  }) {
    const mapSVG = mapContainer
      .append('svg')
      .styles({
        width: `${width}px`,
        height: `${height}px`,
      });

    return mapSVG;
  },
  drawStates({
    // mapSVG,
    statesTopo,
  }) {
    console.log('states topo', statesTopo);
  },
};

export default atlasMethods;
