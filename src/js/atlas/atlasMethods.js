import * as topojson from 'topojson-client';

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
  getGeoData({
    statesTopo,
  }) {
    console.log('statestopo', statesTopo);
    return {
      statesGeo: topojson.feature(
        statesTopo,
        statesTopo.objects.admin1_polygons,
      ),
    };
  },
  getGeoProps({
    width,
    height,
  }) {
    const projection = d3.geoAlbersUsa()
      .scale(1000)
      .translate([width / 2, height / 2]);
    const geoPath = d3.geoPath()
      .projection(projection);
    return {
      geoPath,
      projection,
    };
  },
  setInitialPanZoom({
    statesGeo,
    geoPath,
  }) {
    const bounds = geoPath
      .bounds(statesGeo.features);
    console.log('bounds', bounds);
  },
  drawLayers({
    mapSVG,
  }) {
    return {
      states: mapSVG.append('g'),
      agencies: mapSVG.append('g'),
    };
  },
  drawStates({
    layers,
    width,
    height,
    statesGeo,
    geoPath,
  }) {
    // console.log('states topo', statesTopo);
    layers.states
      .selectAll('.map__state')
      .data(statesGeo.features)
      .enter()
      .append('path')
      .attrs({
        class: 'map__state',
        // fill: 'grey',
        d: geoPath,
      });
  },
};

export default atlasMethods;
