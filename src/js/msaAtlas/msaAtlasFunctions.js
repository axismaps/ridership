

const msaAtlasFunctions = {
  drawAtlas({
    msaMapContainer,
    atlasOuterContainer,
    msa,
    tractGeo,
    currentCensusField,
    logInitialFilters,
    updateAgencyLayers,
    // scaleExtent,
    onZoom,
    saveCamera,
    setMinScale,
    // getCurrentCamera,
    getCurrentCensusField,
    getYears,
    dataProbe,
    setHoverStatus,
    updateStateHighlightedTracts,
    mobile,
  }) {
    let lastFeatureId = null;
    const {
      initSite,
    } = msaAtlasFunctions;

    const drawProbe = ({
      d,
      msaAtlas,
      onProbeRemove = () => { console.log('close'); },
    }) => {
      setHoverStatus(true);
      const queried = msaAtlas.queryRenderedFeatures(d.point)
        .filter(feature => feature.layer.id === 'tract-fill');
      if (queried.length === 0) {
        if (lastFeatureId === null) return;
        msaAtlas.setFeatureState({
          source: 'tracts',
          id: lastFeatureId,
        },
        { hover: false });
        lastFeatureId = null;
        dataProbe.remove();

        updateStateHighlightedTracts([]);
        setHoverStatus(false);
        return;
      }
      const feature = queried[0];
      const offset = 15;
      const containerPos = d3.select('.atlas__msa-map-container')
        .node()
        .getBoundingClientRect();
      const pos = {
        left: d.point.x + offset + containerPos.left,
        bottom: (window.innerHeight - d.point.y - containerPos.top) + offset,
        width: 275,
      };
      if (feature.id !== lastFeatureId && feature.layer.id === 'tract-fill') {
        // console.log('feature', feature);
        if (lastFeatureId !== null) {
          msaAtlas.setFeatureState({
            source: 'tracts',
            id: lastFeatureId,
          },
          { hover: false });
        }

        lastFeatureId = feature.id;
        dataProbe.remove();

        msaAtlas.setFeatureState({
          source: 'tracts',
          id: lastFeatureId,
        },
        { hover: true });
        const s = d3.formatSpecifier('f');
        s.precision = d3.precisionFixed(0.01);
        const f = d3.format(s);
        const censusField = getCurrentCensusField();
        const tractValue = feature.properties[censusField.value];
        // updateStateHighlightedTracts(tractValue * 100);
        updateStateHighlightedTracts([feature.properties]);
        const { id } = feature.properties;
        const years = getYears();
        const firstNum = Number(id.slice(-5, -2));
        const secondNum = Number(id.slice(-2)) / 100;
        const tractNum = secondNum !== 0
          ? f(firstNum + secondNum)
          : firstNum;
        const html = `
          <div class="msa-probe__tract-row">Tract ${tractNum}</div>
          <div class="msa-probe__indicator-row">
            <span class="msa-probe__indicator">${years[0]}-${years[1]} (% change):</span> ${Math.round(tractValue * 100)}%
          </div>
          `;
        dataProbe
          .config({
            pos,
            html,
          })
          .draw(() => {
            onProbeRemove({ msaAtlas });
          });
      } else {
        dataProbe.setPos(pos);
      }
    };

    const onProbeRemove = ({
      msaAtlas,
    }) => {
      if (lastFeatureId === null) return;
      msaAtlas.setFeatureState({
        source: 'tracts',
        id: lastFeatureId,
      },
      { hover: false });
      lastFeatureId = null;


      updateStateHighlightedTracts([]);
      setHoverStatus(false);
    };

    const msaAtlas = new mapboxgl.Map({
      container: msaMapContainer.node(),
      style: 'mapbox://styles/axismaps/cjnvwmhic2ark2sp7fmjuwhf7',
      center: [-71.038412, 42.355046],
      zoom: 10.5,
      // minZoom: scaleExtent[0],
      // maxZoom: scaleExtent[1],
      preserveDrawingBuffer: true,
    })
      .on('click', 'tract-fill', (d) => {
        if (!mobile) return;

        drawProbe({
          msaAtlas,
          d,
          onProbeRemove,
        });
      })
      .on('mousemove', 'tract-fill', (d) => {
        if (mobile) return;
        drawProbe({
          msaAtlas,
          d,
        });
      })
      .on('mouseout', 'tract-fill', () => {
        if (mobile) return;
        onProbeRemove({ msaAtlas });
        dataProbe.remove();
      })
      .on('zoom', () => {
        onZoom(msaAtlas.getZoom());
      })
      .on('load', () => {
        initSite({
          saveCamera,
          msaAtlas,
          msa,
          tractGeo,
          currentCensusField,
          setMinScale,
          atlasOuterContainer,
        });
        // const camera = getCurrentCamera();
        // setMinScale(camera.zoom);
        logInitialFilters(msaAtlas.getStyle());
        msaMapContainer
          .classed('atlas__msa-map-container--loaded', true);
        updateAgencyLayers();
      });

    atlasOuterContainer.select('.atlas__msa-name').text(msa.name);

    return msaAtlas;
  },
  initSite({
    msaAtlas,
    msa,
    tractGeo,
    currentCensusField,
    saveCamera,
    setMinScale,
    atlasOuterContainer,
  }) {
    const {
      jumpToMSA,
      drawTracts,
    } = msaAtlasFunctions;

    jumpToMSA({
      msaAtlas,
      msa,
      saveCamera,

      setMinScale,
    });
    drawTracts({
      msaAtlas,
      tractGeo,
      currentCensusField,
    });
    atlasOuterContainer.select('.atlas__msa-name').text(msa.name);
  },
  jumpToMSA({
    msaAtlas,
    msa,
    saveCamera,
    setMinScale,
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
    saveCamera(camera);
    setMinScale(camera.zoom);
    msaAtlas.setMaxBounds(null);
    msaAtlas.jumpTo(camera);
    msaAtlas.setMaxBounds(msaAtlas.getBounds());
  },
  drawTracts({
    msaAtlas,
    tractGeo,
    currentCensusField,

  }) {
    const currentTractSource = msaAtlas.getSource('tracts');
    if (currentTractSource === undefined) {
      msaAtlas.addSource('tracts', {
        type: 'geojson',
        data: tractGeo,
      });
    } else {
      msaAtlas.removeLayer('tract-fill');
      msaAtlas.removeLayer('tract-outline');
      currentTractSource.setData(tractGeo);
    }
    const tractLayer = {
      id: 'tract-fill',
      type: 'fill',
      source: 'tracts',
      layout: {},
      paint: {
        'fill-color': ['get', `${currentCensusField.value}-color`],
        'fill-opacity': 0.5,
      },
    };

    const tractOutlineLayer = {
      id: 'tract-outline',
      type: 'line',
      source: 'tracts',
      layout: {
        'line-join': 'round',
      },
      paint: {
        'line-color': '#000000',
        'line-width': 3,

        'line-opacity': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          1,
          0,
        ],
      },
    };

    msaAtlas.addLayer(tractLayer, 'building');
    msaAtlas.addLayer(tractOutlineLayer, 'road-label-small');
  },
};

export default msaAtlasFunctions;
