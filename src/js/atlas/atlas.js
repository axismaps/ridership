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
    } = props;

    const {
      getGeoData,
      drawMapSVG,
      getGeoProps,
      drawLayers,
      drawStates,
      setInitialPanZoom,
    } = atlasMethods;

    const {
      statesGeo,
    } = getGeoData({ statesTopo });

    const {
      geoPath,
      projection,
    } = getGeoProps({ width, height });

    setInitialPanZoom({
      statesGeo,
      projection,
      geoPath,
    });

    console.log('states geo', statesGeo);

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
      // mapSVG,
      width,
      height,
      statesGeo,
      geoPath,
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
}

export default Atlas;
