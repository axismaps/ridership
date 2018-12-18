import histogramFunctions from './histogramFunctions';
import DataProbe from '../dataProbe/dataProbe';

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
    } = props;

    const {
      getHistogramData,
      getScales,
      drawSVG,
      setSVGSize,
      drawBars,
      drawAxes,
      drawAverageLine,
      drawAxisLabels,
      updateAxisLabelText,
    } = histogramFunctions;

    const {
      histogramData,
      nationalAverage,
    } = getHistogramData({
      nationalMapData,
      bucketCount,
    });

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
      dataProbe,
    });

    const {
      nationalAverageGroup,
      nationalAverageText,
    } = drawAverageLine({
      svg,
      nationalAverage,
      xScale,
      padding,
      height,
    });

    const {
      xAxisLabel,
      yAxisLabel,
    } = drawAxisLabels({
      container,
      width,
      height,
      padding,
    });

    updateAxisLabelText({
      xAxisLabel,
      yAxisLabel,
      currentIndicator,
      currentScale,
      years,
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
};

class Histogram {
  constructor(config) {
    privateProps.set(this, {
      changeColorScale: null,
      width: null,
      height: null,
      container: null,
      bucketCount: 16,
      padding: {
        top: 30,
        bottom: 65,
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
    });
    const {
      init,
      setDimensions,
      // drawBars,
    } = privateMethods;

    this.config(config);

    setDimensions.call(this);
    init.call(this);
    // drawBars.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  updateData() {
    const props = privateProps.get(this);
    const {
      bars,
      changeColorScale,
      nationalMapData,
      bucketCount,
      padding,
      width,
      height,
      xAxis,
      nationalAverageGroup,
      nationalAverageText,
      yAxis,
      updateHighlightedAgencies,
      nationalDataView,
      currentScale,
      tractGeo,
      currentCensusField,
      dataProbe,
      currentIndicator,
      years,
      xAxisLabel,
      yAxisLabel,
    } = props;


    const {
      updateNational,
      updateMSA,
      updateAxisLabelText,
      getHistogramData,
      getMSAHistogramData,
    } = histogramFunctions;


    updateAxisLabelText({
      xAxisLabel,
      yAxisLabel,
      currentIndicator,
      currentScale,
      years,
      currentCensusField,
    });
    if (currentScale === 'national') {
      const {
        histogramData,
        nationalAverage,
      } = getHistogramData({
        nationalMapData,
        bucketCount,
        nationalDataView,
      });
      updateNational({
        histogramData,
        nationalAverage,
        bars,
        changeColorScale,
        nationalMapData,
        bucketCount,
        padding,
        width,
        height,
        xAxis,
        nationalAverageGroup,
        nationalAverageText,
        yAxis,
        updateHighlightedAgencies,
        nationalDataView,
        dataProbe,
      });
      Object.assign(props, { histogramData, nationalAverage });
    } else if (currentScale === 'msa') {
      const histogramData = getMSAHistogramData({
        tractGeo,
        bucketCount,
        currentCensusField,
      });
      updateMSA({
        histogramData,
        tractGeo,
        bucketCount,
        currentCensusField,
        padding,
        width,
        height,
        xAxis,
        yAxis,
        bars,
        changeColorScale,
        nationalAverageGroup,
        dataProbe,
      });
      Object.assign(props, { histogramData });
    }

    return this;
  }

  updateHighlight() {
    const {
      bars,
      highlightedAgencies,
    } = privateProps.get(this);

    bars.classed('highlight', (d) => {
      const barIds = d.records.map(agency => agency.globalId);
      const highlightIds = highlightedAgencies.map(agency => agency.globalId);
      return highlightIds.some(id => barIds.includes(id));
    });

    return this;
  }

  updateSearchResult() {
    const {
      bars,
      searchResult,
    } = privateProps.get(this);

    bars.classed('search-result', (d) => {
      if (searchResult === null) return false;
      const barIds = d.records.map(agency => agency.globalId);
      return barIds.includes(searchResult.globalId);
    });

    return this;
  }

  updateSize() {
    const {
      setDimensions,
    } = privateMethods;
    const {
      setSVGSize,
      updateAxes,
      getScales,
      resizeBars,
      resizeAverageLine,
      resizeXAxisLabel,
    } = histogramFunctions;

    setDimensions.call(this);

    const {
      width,
      height,
      svg,
      padding,
      histogramData,
      xAxis,
      yAxis,
      bars,
      barSpacing,
      nationalAverage,
      nationalAverageGroup,
      xAxisLabel,
    } = privateProps.get(this);

    setSVGSize({
      width,
      height,
      svg,
    });
    const { yScale, xScale } = getScales({
      padding,
      histogramData,
      width,
      height,
    });

    updateAxes({
      xScale,
      yScale,
      xAxis,
      yAxis,
      padding,
      transition: 0,
    });

    resizeBars({
      bars,
      xScale,
      padding,
      histogramData,
      barSpacing,
    });

    resizeAverageLine({
      padding,
      xScale,
      nationalAverage,
      nationalAverageGroup,
    });

    resizeXAxisLabel({
      xAxisLabel,
      width,
      padding,
      height,
    });
  }
}

export default Histogram;
