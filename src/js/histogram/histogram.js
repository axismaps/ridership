import histogramFunctions from './histogramFunctions';
import DataProbe from '../dataProbe/dataProbe';
import resizeFunctions from './histogramResizeFunctions';
import updateFunctions from './histogramUpdateFunctions';
import dataFunctions from './histogramDataFunctions';
import getPublicMethods from './histogramPublicMethods';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      changeColorScale,
      barSpacing,
      width,
      height,
      bucketCount,
      nationalMapData,
      padding,
      container,
      updateHighlightedAgencies,
      dataProbe,
      currentIndicator,
      currentScale,
      years,
      nationalNtd,
      nationalDataView,
      nationalData,
      updateHighlightedTracts,
      tractGeo,
      currentCensusField,
      distanceFilter,
      mobile,
    } = props;

    const {

      getScales,
      drawSVG,
      drawBars,
      drawAxes,
      drawAverageLine,
      drawAxisLabels,
    } = histogramFunctions;

    const {
      getHistogramData,
      getMSAHistogramData,
    } = dataFunctions;

    const {
      updateAxisLabelText,
    } = updateFunctions;

    const {
      setSVGSize,
    } = resizeFunctions;

    let histogramData;
    let nationalAverage;
    if (currentScale === 'national') {
      ({
        histogramData,
        nationalAverage,
      } = getHistogramData({
        nationalMapData,
        bucketCount,
        nationalDataView,
        nationalData,
        nationalNtd,
        years,
      }));
    } else {
      histogramData = getMSAHistogramData({
        tractGeo,
        bucketCount,
        currentCensusField,
        distanceFilter,
      });
    }

    const { xScale, yScale } = getScales({
      padding,
      histogramData,
      width,
      height,
    });


    const svg = drawSVG({
      container,

    });

    setSVGSize({
      svg,
      width,
      height,
    });

    const { xAxis, yAxis } = drawAxes({
      xScale,
      yScale,
      svg,
      padding,
      height,
    });

    const bars = drawBars({
      svg,
      xScale,
      yScale,
      changeColorScale,
      histogramData,
      padding,
      height,
      width,
      barSpacing,
      updateHighlightedAgencies,
      updateHighlightedTracts,
      dataProbe,
    });
    let nationalAverageGroup;
    let nationalAverageText;
    if (currentScale === 'national') {
      ({
        nationalAverageGroup,
        nationalAverageText,
      } = drawAverageLine({
        svg,
        nationalAverage,
        xScale,
        padding,
        height,
      }));
    }


    const {
      xAxisLabel,
      yAxisLabel,
    } = drawAxisLabels({
      container,
      width,
      height,
      padding,
      mobile,
    });

    updateAxisLabelText({
      xAxisLabel,
      yAxisLabel,
      currentIndicator,
      currentScale,
      years,
      currentCensusField,
    });

    Object.assign(props, {
      bars,
      xAxis,
      yAxis,
      svg,
      nationalAverageGroup,
      nationalAverageText,
      xAxisLabel,
      yAxisLabel,
      histogramData,
      nationalAverage,
    });
  },
  setDimensions() {
    const props = privateProps.get(this);
    const {
      container,
    } = props;

    const {
      width,
      height,
    } = container.node()
      .getBoundingClientRect();
    Object.assign(props, { width, height });
  },
  clearSVG() {
    const {
      svg,
      xAxisLabel,
      yAxisLabel,
    } = privateProps.get(this);
    svg.remove();
    xAxisLabel.remove();
    yAxisLabel.remove();
  },
};

class Histogram {
  constructor(config) {
    const { mobile } = config;
    privateProps.set(this, {
      changeColorScale: null,
      width: null,
      height: null,
      container: null,
      bucketCount: !mobile ? 32 : 16,
      padding: !mobile ? {
        top: 30,
        bottom: 65,
        left: 85,
        right: 20,
      }
        : {
          top: 100,
          bottom: 250,
          left: 85,
          right: 20,
        },
      barSpacing: 5,
      highlightedAgencies: [],
      searchResult: null,
      dataProbe: new DataProbe({
        container: d3.select('.outer-container'),
      }),
      currentScale: 'national',
      legendOn: false,
    });
    const {
      init,
      setDimensions,
      // drawBars,
    } = privateMethods;

    this.config(config);

    const props = privateProps.get(this);

    if (!mobile) {
      setDimensions.call(this);
      init.call(this);
    }

    // drawBars.call(this);
  }
}

Object.assign(
  Histogram.prototype,
  getPublicMethods({ privateMethods, privateProps }),
);

export default Histogram;
