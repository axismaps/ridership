import histogramFunctions from './histogramFunctions';
import resizeFunctions from './histogramResizeFunctions';
import updateFunctions from './histogramUpdateFunctions';
import dataFunctions from './histogramDataFunctions';
import getExport from './histogramExport';

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
      nationalNtd,
      nationalData,
      distanceFilter,
      updateHighlightedTracts,
      mobile,
      mobileHistogramOpen,
      svg,
      barSpacing,
    } = props;

    if (mobile && !mobileHistogramOpen) return this;

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
      nationalDataView,
    });
    if (currentScale === 'national') {
      const {
        histogramData,
        nationalAverage,
      } = getHistogramData({
        nationalMapData,
        bucketCount,
        nationalDataView,
        nationalNtd,
        nationalData,
        years,
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
        svg,
        barSpacing,
        setBars: (newBars) => {
          props.bars = newBars;
        },
      });
      Object.assign(props, { histogramData, nationalAverage });
    } else if (currentScale === 'msa') {
      const histogramData = getMSAHistogramData({
        tractGeo,
        bucketCount,
        currentCensusField,
        distanceFilter,
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
        updateHighlightedTracts,
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
      mobile,
      mobileHistogramOpen,
    } = privateProps.get(this);
    if (mobile && !mobileHistogramOpen) return this;
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
      resizeYAxisLabel,
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
      yAxisLabel,
      mobile,
      mobileHistogramOpen,
    } = privateProps.get(this);

    if (mobile && !mobileHistogramOpen) return;

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
      height,
      padding,
      transition: 0,
    });

    resizeBars({
      bars,
      xScale,
      yScale,
      height,
      padding,
      histogramData,
      barSpacing,
    });

    resizeAverageLine({
      padding,
      xScale,
      height,
      nationalAverage,
      nationalAverageGroup,
    });

    resizeXAxisLabel({
      xAxisLabel,
      width,
      padding,
      height,
    });

    resizeYAxisLabel({
      yAxisLabel,
      mobile,
      padding,
      height,
    });
  },

  setLegendStatus() {
    const {
      container,
      legendOn,
    } = privateProps.get(this);
    container
      .classed('histogram--legend-on', legendOn);
    return this;
  },

  updateHighlightedTracts() {
    const {
      bars,
      highlightedTracts,
    } = privateProps.get(this);

    bars.classed('highlight', (d) => {
      const barIds = d.records.map(tract => tract.id);
      const highlightIds = highlightedTracts.map(tract => tract.id);
      return barIds.some(id => highlightIds.includes(id));
    });
  },

  updateToggle() {
    const {
      mobileHistogramOpen,
    } = privateProps.get(this);
    const {
      setDimensions,
      init,
      clearSVG,
    } = privateMethods;

    if (mobileHistogramOpen) {
      setDimensions.call(this);
      init.call(this);
    } else {
      clearSVG.call(this);
    }
  },

  export: getExport({ privateProps }),
});

export default getPublicMethods;
