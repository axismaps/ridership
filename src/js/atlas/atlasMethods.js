import * as topojsonBase from 'topojson-client';
import * as topojsonSimplify from 'topojson-simplify';

const topojson = Object.assign({}, topojsonBase, topojsonSimplify);

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
      .translate([width / 2, height / 2]);

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
    agencies,
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

      agencies.attrs({
        transform: `translate(${transform.x},${transform.y})scale(${transform.k})`,
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
    layer,
    statesTopo,
    geoPath,
  }) {
    const simpleTopo = topojson.simplify(topojson.presimplify(statesTopo), 0.001);
    return layer

      .append('path')

      .datum(topojson.feature(simpleTopo, simpleTopo.objects.admin1_polygons))
      .attrs({
        class: 'map__state',
        d: geoPath,
        'stroke-width': 1.5,
      });
  },
  getRadiusScale({
    nationalMapData,
    indicator,
  }) {
    // const allTa = nationalMapData.reduce((accumulator, ))
  },
  drawAgencies({
    nationalMapData,
    layer,
    projection,
    indicator,
  }) {
    console.log('national map data', nationalMapData);
    console.log('indicator', indicator);
    console.log('d3 force', d3.forceSimulation());
    // calculate radius scale
    // create cluster diagram, each msa is a section, etc.
    const agencies = layer.selectAll('.map__agency')
      .data(nationalMapData)
      .enter()
      .append('circle')
      .attrs({
        r: 3,
        fill: 'orange',
        cx: d => projection(d.cent)[0],
        cy: d => projection(d.cent)[1],
      });

    return agencies;
  },
};

export default atlasMethods;
