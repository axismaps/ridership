import atlasMethods from './atlasMethods';
import DataProbe from '../dataProbe/dataProbe';

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
      dataProbe,
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
      dataProbe,
      layer: layers.agencies,
      nationalMapData,
      projection,
      changeColorScale,
      projectionModify,
      logSimulationNodes: (nodes) => {
        props.nodes = nodes;
      },
    });

    const zoomed = getZoomed({
      states,
      // agencies,
      getAgencies: () => props.agencies,
      initialScale,
      initialTranslate,
      projectionModify,
      geoPath,
      setCurrentTransform: (newTransform) => {
        props.transform = newTransform;
      },
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
      projection,
      projectionModify,
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
      dataProbe: new DataProbe({
        container: d3.select('.outer-container'),
      }),
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

  updateYears() {
    const props = privateProps.get(this);
    const { nationalMapData } = props;
    console.log('currentnationaldata', nationalMapData);
  }

  updateNationalMapData() {
    const props = privateProps.get(this);
    const {
      // layers,
      nationalMapData,
      // projection,
      changeColorScale,
      // projectionModify,
      agencies,
      nodes,
    } = props;
    const {
      // drawAgencies,
      setAgencyColors,
    } = atlasMethods;

    setAgencyColors({
      agencies,
      changeColorScale,
      nationalMapData,
      nodes,
    });
    // props.agencies = drawAgencies({
    //   layer: layers.agencies,
    //   nationalMapData,
    //   projection,
    //   changeColorScale,
    //   projectionModify,
    // });
  }
}

export default Atlas;
