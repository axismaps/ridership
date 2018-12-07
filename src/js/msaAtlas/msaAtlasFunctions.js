const msaAtlasFunctions = {
  drawAtlas({
    msaMapContainer,
    msa,
    tractGeo,
    currentCensusField,
    distanceFilter,
  }) {
    const {
      initSite,
    } = msaAtlasFunctions;
    const msaAtlas = new mapboxgl.Map({
      container: msaMapContainer.node(),
      style: 'mapbox://styles/axismaps/cjnvwmhic2ark2sp7fmjuwhf7',
      center: [-71.038412, 42.355046],
      zoom: 10.5,
    })
      .on('load', () => {
        initSite({
          distanceFilter,
          msaAtlas,
          msa,
          tractGeo,
          currentCensusField,
        });
        msaMapContainer
          .classed('atlas__msa-map-container--loaded', true);
      });

    return msaAtlas;
  },
  initSite({
    distanceFilter,
    msaAtlas,
    msa,
    tractGeo,
    currentCensusField,
  }) {
    const {
      jumpToMSA,
      drawTracts,
    } = msaAtlasFunctions;

    jumpToMSA({
      msaAtlas,
      msa,
    });
    drawTracts({
      distanceFilter,
      msaAtlas,
      tractGeo,
      currentCensusField,
    });
  },
  jumpToMSA({
    msaAtlas,
    msa,
  }) {
    const {
      maxX,
      maxY,
      minX,
      minY,
    } = msa;
    const sw = new mapboxgl.LngLat(minX, minY);
    const ne = new mapboxgl.LngLat(maxX, maxY);
    const bounds = new mapboxgl.LngLatBounds(sw, ne);
    const camera = msaAtlas.cameraForBounds(bounds);
    msaAtlas.jumpTo(camera);
  },
  drawTracts({
    msaAtlas,
    tractGeo,
    currentCensusField,
    distanceFilter,
  }) {
    const tractGeoFiltered = Object.assign({}, tractGeo);
    tractGeoFiltered.features = tractGeo.features.filter((d) => {
      const isDefined = d.properties[`${currentCensusField.value}-color`] !== null
      && d.properties[`${currentCensusField.value}-color`] !== undefined;
      const inDistance = distanceFilter === null ? true
        : d.properties.dist <= distanceFilter.value;
      return isDefined && inDistance;
    });
    // tractGeoFiltered.features.forEach((d) => {
    //   console.log(d.properties.dist);
    // });

    const currentTractSource = msaAtlas.getSource('tracts');
    if (currentTractSource === undefined) {
      msaAtlas.addSource('tracts', {
        type: 'geojson',
        data: tractGeoFiltered,
      });
    } else {
      msaAtlas.removeLayer('tract-fill');
      currentTractSource.setData(tractGeoFiltered);
    }
    const tractLayer = {
      id: 'tract-fill',
      type: 'fill',
      source: 'tracts',
      layout: {},
      paint: {
        'fill-color': ['get', `${currentCensusField.value}-color`],
        // 'fill-opacity': 0.5,
      },
    };
    msaAtlas.addLayer(tractLayer, 'building');
  },
};

export default msaAtlasFunctions;
