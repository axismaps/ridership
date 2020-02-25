

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
    bounds,
    msaLabels,
    msaPolygons,
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
        right: 'auto',
        width: 275,
      };
      if (pos.left > window.innerWidth - 300) {
        pos.left = 'auto';
        pos.right = window.innerWidth - (d.point.x - offset + containerPos.left);
      }
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
        const tractValue = feature.properties[censusField.id];
        // updateStateHighlightedTracts(tractValue * 100);
        updateStateHighlightedTracts([feature.properties]);
        const { id } = feature.properties;
        const years = getYears();
        const firstNum = Number(id.slice(-5, -2));
        const secondNum = Number(id.slice(-2)) / 100;
        const tractNum = secondNum !== 0
          ? f(firstNum + secondNum)
          : firstNum;
        let valueLabel;
        let valueText;
        let nominalValsText = '';
        const nominalValue0 = feature.properties[`${censusField.value}0`];
        const nominalValue1 = feature.properties[censusField.value];
        const fmt = censusField.format || 'd';
        const displayUnit = censusField.unit && censusField.unit !== '%' ? censusField.unit : '';
        if (censusField.change) {
          nominalValsText = `
            <span class="msa-probe__indicator">${years[0]}:</span> ${d3.format(fmt)(nominalValue0)}${displayUnit}<br>
            <span class="msa-probe__indicator">${years[1]}:</span> ${d3.format(fmt)(nominalValue1)}${displayUnit}<br>
          `;
          valueLabel = `${years[0]}-${years[1]} (% ${censusField.unit === '%' ? 'point' : ''} change):`;
          valueText = `${Math.round(tractValue * 100)}%`;
        } else {
          valueLabel = `${years[1]}:`;
          valueText = `${d3.format(fmt)(tractValue)}${displayUnit}`;
        }
        const html = `
          <div class="msa-probe__tract-row">Tract ${tractNum}</div>
          <div class="msa-probe__indicator-row msa-probe__indicator-title">${censusField.text.replace('Change in ', '')}</div>
          <div class="msa-probe__indicator-row">
            ${nominalValsText}
            <span class="msa-probe__indicator">${valueLabel}</span> ${valueText}
          </div>
          `;
        dataProbe
          .config({
            pos,
            html,
            onRemove: () => {
              onProbeRemove({ msaAtlas });
            },
          })
          .draw();
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
        // if (mobile) return;
        onProbeRemove({ msaAtlas });
        dataProbe.remove();
      })
      .on('move', () => {
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
          bounds,
          tractGeo,
          currentCensusField,
          setMinScale,
          atlasOuterContainer,
          msaLabels,
          msaPolygons,
        });
        // const camera = getCurrentCamera();
        // setMinScale(camera.zoom);
        if (msaAtlas.getLayer('tracts')) msaAtlas.removeLayer('tracts');
        logInitialFilters(msaAtlas.getStyle());
        msaMapContainer
          .classed('atlas__msa-map-container--loaded', true);
        updateAgencyLayers();
      });

    msaAtlas.dragRotate.disable();
    msaAtlas.touchZoomRotate.disableRotation();

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
    bounds,
    msaPolygons,
    msaLabels,
  }) {
    const {
      jumpToMSA,
      drawTracts,
      drawAnnotations,
    } = msaAtlasFunctions;

    jumpToMSA({
      msaAtlas,
      msa,
      saveCamera,
      bounds,
      setMinScale,
    });
    drawTracts({
      msaAtlas,
      tractGeo,
      currentCensusField,
    });
    drawAnnotations({
      msaAtlas,
      msaPolygons,
      msaLabels,
    });
    atlasOuterContainer.select('.atlas__msa-name').text(msa.name);
  },
  jumpToMSA({
    msaAtlas,
    msa,
    saveCamera,
    setMinScale,
    bounds,
  }) {
    const {
      maxX,
      maxY,
      minX,
      minY,
    } = msa;
    const sw = new mapboxgl.LngLat(minX, minY);
    const ne = new mapboxgl.LngLat(maxX, maxY);
    const mapBounds = bounds || new mapboxgl.LngLatBounds(sw, ne);
    const camera = msaAtlas.cameraForBounds(mapBounds);
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
        'fill-color': ['get', `${currentCensusField.id}-color`],
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

    msaAtlas.addLayer(tractLayer, 'aeroway-polygon');
    msaAtlas.addLayer(tractOutlineLayer, 'road-label-small');
  },

  drawAnnotations({
    msaAtlas,
    msaLabels,
    msaPolygons,
  }) {
    if (msaPolygons) {
      msaAtlas.addSource('msaPolygons', {
        type: 'geojson',
        data: msaPolygons,
      });
      msaAtlas.addLayer({
        id: 'msaPolygons',
        type: 'line',
        source: 'msaPolygons',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 5,
        },
      });
    }
    if (msaLabels) {
      msaAtlas.addSource('msaLabels', {
        type: 'geojson',
        data: msaLabels,
      });
      msaAtlas.addLayer({
        id: 'msaLabelsText',
        type: 'symbol',
        source: 'msaLabels',
        layout: {
          'text-field': '{label}',
          'text-size': 20,
          'text-font': [
            'Mark Offc Pro Bold',
            'Helvetica Neue Medium',
            'Open Sans Regular',
            'Arial Unicode MS Regular',
          ],
        },
        paint: {
          'text-halo-color': 'white',
          'text-halo-width': 2,
          'text-halo-blur': 2,
        },
      });
    }
  },
};

export default msaAtlasFunctions;
