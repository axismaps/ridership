import histogramFunctions from './histogramFunctions';
import resizeFunctions from './histogramResizeFunctions';
import updateFunctions from './histogramUpdateFunctions';
import dataFunctions from './histogramDataFunctions';

const getPublicMethods = ({ privateMethods, privateProps }) => ({
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  },

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

      getHistogramData,
      getMSAHistogramData,
    } = dataFunctions;

    const {
      updateNational,
      updateMSA,
      updateAxisLabelText,
    } = updateFunctions;


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
  },

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
  },

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
  },

  updateSize() {
    const {
      setDimensions,
    } = privateMethods;
    const {
      getScales,
    } = histogramFunctions;

    const {
      updateAxes,
    } = updateFunctions;

    const {
      setSVGSize,
      resizeBars,
      resizeAverageLine,
      resizeXAxisLabel,
    } = resizeFunctions;

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
  },

  export() {
    const {
      exportMethods,
      svg,
    } = privateProps.get(this);

    const svgNode = svg.node();
    const { SVGtoCanvas } = exportMethods;

    return SVGtoCanvas({ svgNode });
  },
});

export default getPublicMethods;
