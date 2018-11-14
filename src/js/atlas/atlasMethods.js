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
    allAgencies,
    indicator,
  }) {
    // const allAgencies = nationalMapData
    //   .reduce((accumulator, msa) => [...accumulator, ...msa.ta.map(d => d.ntd[indicator])], []);
    const values = allAgencies.map(d => d[indicator]);
    return d3.scaleSqrt()
      .domain(d3.extent(values))
      .range([2, 10]);
  },
  drawAgencies({
    nationalMapData,
    layer,
    projection,
    indicator,
  }) {
    const {
      getRadiusScale,
    } = atlasMethods;
    console.log('national map data', nationalMapData);

    const allAgencies = nationalMapData
      .reduce((accumulator, msa) => [...accumulator, ...msa.ta], []);

    const radiusScale = getRadiusScale({
      allAgencies,
      indicator,
    });

    // const centers = nationalMapData.reduce((accumulator, msa) => {
    //   accumulator[msa.msaId] = {
    //     x: projection(msa.cent)[0],
    //     y: projection(msa.cent)[1],
    //   };
    //   return accumulator;
    // }, {});


    const nodes = allAgencies.map(agency => ({
      cluster: agency.msaId,
      radius: radiusScale(agency[indicator]),
      x: projection(agency.cent)[0] + (Math.random() / 100),
      y: projection(agency.cent)[1] + (Math.random() / 100),
    }));
    console.log('nodes', nodes);

    const agencies = layer.selectAll('.map__agency')
      .data(nodes)
      .enter()
      .append('circle')
      .attrs({
        class: 'map__agency',
        fill: 'orange',
      })
      .on('mouseover', (d) => {
        console.log(d.cluster);
      });

    const layoutTick = () => {
      agencies
        .attrs({
          cx: d => d.x,
          cy: d => d.y,
          r: d => d.radius,
        });
    };

    const simulation = d3.forceSimulation()
      .force('x', d3.forceX().x(d => d.x))
      .force('y', d3.forceY().y(d => d.y))
      .force('collide', d3.forceCollide(d => d.radius + 0.5))
      .on('tick', layoutTick)
      .nodes(nodes);

    return agencies;
  },
};

export default atlasMethods;
