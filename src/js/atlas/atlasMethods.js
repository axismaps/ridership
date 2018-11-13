import * as topojson from 'topojson-client';
import * as topojsonSimplify from 'topojson-simplify';

console.log('presim', topojsonSimplify);
Object.assign(topojson, topojsonSimplify);

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
    // .scale(1000)
      // .scale(1)
      .translate([width / 2, height / 2]);
    console.log('scale?', projection.scale());
    console.log('translate?', projection.translate());
    const geoPath = d3.geoPath()
      .projection(projection);
    return {
      geoPath,
      projection,
    };
  },
  getInitialScaleTranslate({
    projection,
  }) {
    return {
      initialTranslate: projection.translate(),
      initialScale: projection.scale(),
    };
  },
  drawLayers({
    mapSVG,
  }) {
    return {
      states: mapSVG.append('g'),
      agencies: mapSVG.append('g'),
    };
  },
  getZoomed({
    states,
    // initialScale,
    // initialTranslate,
    // projection,
    // geoPath,
  }) {
    return () => {
      const { transform } = d3.event;
      // console.log('transform', transform);
      // projection
      //   .translate([(initialTranslate[0] * transform.k) + transform.x,
      //     (initialTranslate[1] * transform.k) + transform.y])
      //   .scale(initialScale * transform.k);

      // states.attr('d', geoPath);
      states.attrs({
        transform: `translate(${transform.x},${transform.y})scale(${transform.k})`,
        'stroke-width': 1.5 / transform.k,
      });
    };
  },
  setZoomEvents({
    zoomed,
    mapSVG,
  }) {
    const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on('zoom', zoomed);
    mapSVG.call(zoom);
  },
  drawStates({
    layers,
    // statesGeo,
    statesTopo,
    geoPath,
  }) {
    const simpleTopo = topojson.simplify(topojson.presimplify(statesTopo), 0.001);
    return layers.states

      .append('path')

      .datum(topojson.feature(simpleTopo, simpleTopo.objects.admin1_polygons))
      .attrs({
        class: 'map__state',
        d: geoPath,
        'stroke-width': 1.5,
      });
  },
};

export default atlasMethods;
