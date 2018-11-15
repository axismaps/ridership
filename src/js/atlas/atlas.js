import atlasMethods from './atlasMethods';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);

    const {
      mapContainer,
      width,
      height,
      statesTopo,
      nationalMapData,
      changeColorScale,
    } = props;

    const {
      drawMapSVG,
      getGeoProps,
      drawLayers,
      drawStates,
      getZoomed,
      setZoomEvents,
      getInitialScaleTranslate,
      drawAgencies,
    } = atlasMethods;

    const {
      geoPath,
      projection,
      projectionModify,
    } = getGeoProps({ width, height });

    const {
      initialTranslate,
      initialScale,
    } = getInitialScaleTranslate({ projection });

    const mapSVG = drawMapSVG({
      mapContainer,
      width,
      height,
    });

    const layers = drawLayers({
      mapSVG,
    });

    const states = drawStates({
      layer: layers.states,
      statesTopo,
      geoPath,
    });

    const agencies = drawAgencies({
      layer: layers.agencies,
      nationalMapData,
      projection,
      changeColorScale,
    });

    const zoomed = getZoomed({
      states,
      agencies,
      initialScale,
      initialTranslate,
      projectionModify,
      geoPath,

    });

    setZoomEvents({
      zoomed,
      mapSVG,
    });

    Object.assign(props, {
      states,
      agencies,
      layers,
      mapSVG,
    });
  },
};

class Atlas {
  constructor(config) {
    const mapContainer = d3.select('.atlas__map-container');
    const {
      width,
      height,
    } = mapContainer.node().getBoundingClientRect();
    privateProps.set(this, {
      mapContainer,
      width,
      height,
      statesTopo: null,
      layers: null,
      nationalMapData: null,
    });
    const {
      init,
    } = privateMethods;

    this.config(config);

    init.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  updateYear() {
    const props = privateProps.get(this);
    const { nationalMapData } = props;
    console.log('currentnationaldata', nationalMapData);
  }
}

export default Atlas;
