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
      nationalNtd,
      nationalData,
      distanceFilter,
      updateHighlightedTracts,
      mobile,
      mobileHistogramOpen,
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

    // bars.classed('highlight', d => (highlightedTracts !== null
    //   ? d.records.map(dd => dd.id)
    //     .includes(highlightedTracts.id)
    //   : false));
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

  export() {
    const {
      exportMethods,
      svg,
      container,
      xAxisLabel,
      yAxisLabel,
    } = privateProps.get(this);

    const svgNode = svg.node();
    const { SVGtoCanvas } = exportMethods;

    return SVGtoCanvas({ svgNode })
      .then((canvas) => {
        const bbox = container.node().getBoundingClientRect();
        const {
          width,
          height,
        } = bbox;
        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = width;
        fullCanvas.height = height;
        const ctx = fullCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0);
        ctx.fillStyle = '#000';
        ctx.font = 'normal normal 300 12px Mark, Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        const yWords = yAxisLabel.text().split(' ');
        const lines = [];
        yWords.forEach((word) => {
          if (lines.length === 0) {
            lines.push(word);
          } else {
            const newLine = `${lines[lines.length - 1]} ${word}`;
            if (ctx.measureText(newLine).width > 100 && newLine.includes(' ')) {
              lines.push(word);
            } else {
              lines[lines.length - 1] = newLine;
            }
          }
        });

        lines.forEach((line, i) => {
          const yOffset = lines.length - i * 15;
          ctx.save();
          ctx.translate(45 - yOffset, 75);
          ctx.rotate(-Math.PI / 2);
          ctx.fillText(line, 0, 0);
          ctx.restore();
        });

        ctx.fillText(xAxisLabel.text(), width / 2, height - 15);

        return Promise.resolve(fullCanvas);
      });
  },
});

export default getPublicMethods;
