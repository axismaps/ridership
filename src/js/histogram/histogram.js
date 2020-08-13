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
      valueColorScale,
      barSpacing,
      width,
      height,
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
      regionCensus,
      currentCensusField,
      mobile,
      msa,
    } = props;

    const {
      getColors,
      getScales,
      drawSVG,
      drawBars,
      drawAxes,
      drawAverageLine,
      drawAxisLabels,
      addNationalBarMouseEvents,
      addMSABarMouseEvents,
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

    const bucketCount = mobile || (currentCensusField && !currentCensusField.change) ? 16 : 32;

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
        mobile,
      }));
    } else {
      if (tractGeo === undefined || tractGeo === null) return;
      ({
        histogramData,
        nationalAverage,
      } = getMSAHistogramData({
        tractGeo,
        regionCensus,
        bucketCount,
        currentCensusField,
        mobile,
      }));
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
      width,
      currentCensusField,
    });

    const colorScale = getColors({ changeColorScale });

    const bars = drawBars({
      svg,
      xScale,
      yScale,
      colorScale,
      histogramData,
      padding,
      height,
      width,
      barSpacing,
      updateHighlightedAgencies,
      updateHighlightedTracts,
      dataProbe,
      nationalDataView,
    });

    if (currentScale === 'national') {
      addNationalBarMouseEvents({
        bars,
        updateHighlightedAgencies,
        dataProbe,
        nationalDataView,
        mobile,
      });
    } else {
      addMSABarMouseEvents({
        bars,
        dataProbe,
        updateHighlightedTracts,
        mobile,
        currentCensusField,
      });
    }

    const {
      nationalAverageGroup,
      nationalAverageText,
    } = drawAverageLine({
      svg,
      nationalAverage,
      xScale,
      padding,
      height,
      msa,
    });


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
      nationalDataView,
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
      bucketCount,
    });

    d3.select('.footer__histogram')
      .classed('histogram--empty', histogramData.length === 0);
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
          top: 30,
          bottom: 50,
          left: 50,
          right: 40,
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


    if (!mobile) {
      setDimensions.call(this);
      init.call(this);
    }

    this.setLegendStatus();
    this.updateSize();

    // drawBars.call(this);
  }
}

Object.assign(
  Histogram.prototype,
  getPublicMethods({ privateMethods, privateProps }),
);

export default Histogram;
