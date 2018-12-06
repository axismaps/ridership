const msaAtlasFunctions = {
  drawAtlas({
    msaMapContainer,
    msa,
    tractGeo,
    currentCensusField,
  }) {
    const {
      drawSite,
    } = msaAtlasFunctions;
    const msaAtlas = new mapboxgl.Map({
      container: msaMapContainer.node(),
      style: 'mapbox://styles/axismaps/cjnvwmhic2ark2sp7fmjuwhf7',
      center: [-71.038412, 42.355046],
      zoom: 10.5,
    })
      .on('load', () => {
        // console.log('style', msaAtlas.getStyle());
        drawSite({
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
  drawSite({
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
  }) {
    const tractGeoFiltered = Object.assign({}, tractGeo);
    tractGeoFiltered.features = tractGeo.features.filter(d => d.properties[`${currentCensusField.value}-color`] !== null
    && d.properties[`${currentCensusField.value}-color`] !== undefined);

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
