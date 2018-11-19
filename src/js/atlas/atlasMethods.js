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

    const projectionModify = d3.geoAlbersUsa()
      .translate([width / 2, height / 2]);

    const geoPath = d3.geoPath()
      .projection(projection);

    return {
      geoPath,
      projection,
      projectionModify,
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
    getAgencies,
    initialScale,
    initialTranslate,
    projectionModify,
    setCurrentTransform,
  }) {
    return () => {
      const { transform } = d3.event;
      setCurrentTransform(transform);

      const agencies = getAgencies();
      /**
       * Re-project cluster nodes.
       * Everything else is scaled w/ un-modified original projection
       * @private
       */
      projectionModify
        .translate([(initialTranslate[0] * transform.k) + transform.x,
          (initialTranslate[1] * transform.k) + transform.y])
        .scale(initialScale * transform.k);

      states.attrs({
        transform: `translate(${transform.x},${transform.y})scale(${transform.k})`,
        'stroke-width': 1.5 / transform.k,
      });

      // const getCenter = ({
      //   d,
      //   original,
      //   unshiftedPos,
      // }) => {
      //   const change = d - original;
      //   return unshiftedPos + change + ((change * transform.k) / 20) - (change / 20);
      // };
      const getCenter = ({
        d,
        original,
        unshiftedPos,
      }) => {
        const change = d - original;
        return unshiftedPos + change;
      };
      agencies.attrs({
        cx: d => getCenter({
          d: d.x,
          original: d.xOriginal,
          unshiftedPos: projectionModify(d.cent)[0],
        }),
        cy: d => getCenter({
          d: d.y,
          original: d.yOriginal,
          unshiftedPos: projectionModify(d.cent)[1],
        }),
      });
      // agencies.attrs({
      //   cx: d => d.x,
      //   cy: d => d.y,
      // });
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
    // indicator,
  }) {
    const values = allAgencies.map(d => d.indicatorValue);
    return d3.scaleSqrt()
      .domain(d3.extent(values))
      .range([5, 35]);
  },
  drawAgencies({
    nationalMapData,
    layer,
    projectionModify,
    changeColorScale,
    // indicator,
  }) {
    const {
      getRadiusScale,
    } = atlasMethods;

    const allAgencies = nationalMapData
      .reduce((accumulator, msa) => [...accumulator, ...msa.ta], [])
      .sort((a, b) => b.indicatorValue - a.indicatorValue);

    const radiusScale = getRadiusScale({
      allAgencies,
      // indicator,
    });


    const nodes = allAgencies.map(agency => ({
      cluster: agency.msaId,
      taId: agency.taId,
      radius: radiusScale(agency.indicatorValue),
      x: projectionModify(agency.cent)[0],
      y: projectionModify(agency.cent)[1],
      xOriginal: projectionModify(agency.cent)[0],
      yOriginal: projectionModify(agency.cent)[1],
      cent: agency.cent,
      color: changeColorScale(agency.pctChange),
      pctChange: agency.pctChange,
    }));

    const agencies = layer.selectAll('.map__agency')
      .data(nodes, d => d.taId);

    const newAgencies = agencies
      .enter()
      .append('circle')
      .attrs({
        cx: d => d.xOriginal,
        cy: d => d.yOriginal,
        r: 0,
        class: 'map__agency',
        fill: d => d.color,
      })
      .on('mouseover', (d) => {
        console.log(d);
      });

    agencies.exit().remove();

    const mergedAgencies = newAgencies.merge(agencies);

    const layoutTick = () => {
      mergedAgencies
        .transition()
        .duration(500)
        .attrs({
          cx: d => d.x,
          cy: d => d.y,
          r: d => d.radius,
        });
    };

    const simulation = d3.forceSimulation()
      .force('x', d3.forceX().x(d => d.x))
      .force('y', d3.forceY().y(d => d.y))
      // .force('collide', d3.forceCollide(d => d.radius * 0.8))
      .force('collide', d3.forceCollide(d => d.radius))
      .nodes(nodes)
      .stop();

    for (let i = 0; i < 300; i += 1) {
      simulation.tick();
    }

    layoutTick();
    return mergedAgencies;
  },
};

export default atlasMethods;
