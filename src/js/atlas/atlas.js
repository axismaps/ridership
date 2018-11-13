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
      currentNationalMapData,
    } = props;
    console.log('current map data', currentNationalMapData);
    const {
      drawMapSVG,
      getGeoProps,
      drawLayers,
      drawStates,
      getZoomed,
      setZoomEvents,
      getInitialScaleTranslate,
    } = atlasMethods;

    const {
      geoPath,
      projection,
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
      layers,
      statesTopo,
      geoPath,
    });

    const zoomed = getZoomed({
      states,
      initialScale,
      initialTranslate,
      projection,
      geoPath,
    });

    setZoomEvents({
      zoomed,
      mapSVG,
    });

    Object.assign(props, {
      states,
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
      currentNationalMapData: null,
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
    const { currentNationalMapData } = props;
    console.log('currentnationaldata', currentNationalMapData);
  }
}

export default Atlas;
