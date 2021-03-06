import localFunctions from './histogramLocalFunctions';
import histogramFunctions from './histogramFunctions';

const updateFunctions = {
  updateAverageLine({
    nationalAverageGroup,
    nationalAverage,
    xScale,
    padding,
    nationalAverageText,
    currentCensusField,
    msa,
  }) {
    const {
      getNationalAverageText,
      getAverageLinePosition,
    } = localFunctions;

    nationalAverageText
      .text(getNationalAverageText({ nationalAverage, currentCensusField, msa }));

    nationalAverageGroup
      .style('opacity', nationalAverage === null ? 0 : 1)
      .transition()
      .duration(500)
      .attrs(getAverageLinePosition({
        padding,
        xScale,
        nationalAverage,
      }));

    let anchor = 'middle';
    if (xScale(nationalAverage) < (3 * xScale.range()[0] + xScale.range()[1]) / 4) {
      anchor = 'start';
    } else if (xScale(nationalAverage) > (3 * xScale.range()[1] + xScale.range()[0]) / 4) {
      anchor = 'end';
    }
    nationalAverageGroup
      .select('text')
      .attr('x', '0')
      .attr('text-anchor', anchor);
  },
  updateAxes({
    xScale,
    yScale,
    xAxis,
    yAxis,
    height,
    padding,
    transition = 500,
    currentCensusField,
  }) {
    const {
      getYAxisGenerator,
      getXAxisGenerator,
    } = localFunctions;

    const xAxisGenerator = getXAxisGenerator({ xScale });
    if (currentCensusField && !currentCensusField.change) {
      xAxisGenerator.tickFormat(d3.format(currentCensusField.format));
    } else {
      xAxisGenerator.tickFormat(d3.format('d'));
    }

    yAxis
      .attrs({
        transform: `translate(${padding.left + xScale.range()[1]}, ${padding.top})`,
      })
      .transition()
      .duration(transition)
      .call(getYAxisGenerator({ xScale, yScale }));

    xAxis
      .attrs({
        transform: `translate(${padding.left}, ${height - padding.bottom})`,
      })
      .transition()
      .duration(transition)
      .call(xAxisGenerator);
  },
  updateBars({
    bars,
    histogramData,
    yScale,
    colorScale,
    height,
    padding,
  }) {
    bars
      .data(histogramData, d => d.index)
      .transition()
      .duration(500)
      .attrs({
        height: d => yScale(d.count),
        y: d => (height - padding.bottom) - yScale(d.count),
        fill: d => colorScale((d.bucket[1] + d.bucket[0]) / 2),
        stroke: '#999999',
        'stroke-width': 1,
      });
  },

  updateNational({
    // bars,
    setBars,
    changeColorScale,
    padding,
    width,
    height,
    xAxis,
    nationalAverageGroup,
    nationalAverageText,
    yAxis,
    updateHighlightedAgencies,
    dataProbe,
    histogramData,
    nationalAverage,
    nationalDataView,
    svg,
    barSpacing,
    mobile,
  }) {
    const {
      getColors,
      getScales,
      drawBars,
      addNationalBarMouseEvents,
    } = histogramFunctions;

    const {
      // updateBars,
      updateAxes,
      updateAverageLine,
    } = updateFunctions;

    const { yScale, xScale } = getScales({
      padding,
      histogramData,
      width,
      height,
    });

    const colorScale = getColors({ changeColorScale });

    updateAxes({
      xScale,
      yScale,
      xAxis,
      yAxis,
      padding,
      height,
    });
    const bars = drawBars({
      svg,
      xScale,
      yScale,
      colorScale,
      padding,
      height,
      histogramData,
      barSpacing,
      updateHighlightedAgencies,
      dataProbe,
      nationalDataView,
    });
    setBars(bars);
    addNationalBarMouseEvents({
      bars,
      updateHighlightedAgencies,
      dataProbe,
      nationalDataView,
      mobile,
    });


    updateAverageLine({
      nationalAverageGroup,
      nationalAverage,
      nationalAverageText,
      xScale,
      padding,
    });

    d3.select('.footer__histogram')
      .classed('histogram--empty', histogramData.length === 0);
  },
  updateAxisLabelText({
    xAxisLabel,
    yAxisLabel,
    currentIndicator,
    currentScale,
    years,
    currentCensusField,
    nationalDataView,
  }) {
    const isNational = currentScale === 'national';
    const yText = isNational
      ? `Number of ${nationalDataView === 'ta' ? 'transit agencies' : 'MSAs'}`
      : 'Number of census tracts';

    let xText;
    if (isNational) {
      xText = `${currentIndicator.text} (% change, ${years[0]}-${years[1]})`;
    } else if (currentCensusField.change && currentCensusField.unit === '%') {
      xText = `${currentCensusField.text} (% point change, ${years[0]}-${years[1]})`;
    } else if (currentCensusField.change) {
      xText = `${currentCensusField.text} (% change, ${years[0]}-${years[1]})`;
    } else {
      xText = `${currentCensusField.text} (${years[1]})`;
    }

    yAxisLabel
      .text(yText);

    xAxisLabel
      .text(xText);

    d3.select('.histogram__no-data span')
      .html(`${isNational ? currentIndicator.text : currentCensusField.text}, ${!isNational && currentCensusField.change ? years.join('–') : years[1]}`);
  },
  updateMSA({
    padding,
    width,
    height,
    xAxis,
    yAxis,
    // bars,
    nationalAverage,
    nationalAverageText,
    nationalAverageGroup,
    changeColorScale,
    valueColorScale,
    dataProbe,
    histogramData,
    currentCensusField,
    updateHighlightedTracts,
    svg,
    barSpacing,
    updateHighlightedAgencies,
    nationalDataView,
    mobile,
    msa,
  }) {
    const {
      // getMSAHistogramData,
      getColors,
      getScales,
      drawBars,
      addMSABarMouseEvents,
    } = histogramFunctions;

    const {
      updateAxes,
      updateAverageLine,
    } = updateFunctions;

    const { yScale, xScale } = getScales({
      padding,
      histogramData,
      width,
      height,
    });

    const colorScale = getColors({
      changeColorScale,
      valueColorScale,
      currentCensusField,
      histogramData,
    });

    updateAxes({
      padding,
      xScale,
      yScale,
      xAxis,
      yAxis,
      height,
      currentCensusField,
    });

    // updateBars({
    //   bars,
    //   histogramData,
    //   yScale,
    //   changeColorScale,
    //   height,
    //   padding,
    // });

    const bars = drawBars({
      svg,
      xScale,
      yScale,
      colorScale,
      padding,
      height,
      histogramData,
      barSpacing,
      updateHighlightedAgencies,
      dataProbe,
      nationalDataView,
    });

    addMSABarMouseEvents({
      bars,
      dataProbe,
      updateHighlightedTracts,
      mobile,
      currentCensusField,
    });

    updateAverageLine({
      nationalAverageGroup,
      nationalAverage,
      nationalAverageText,
      xScale,
      padding,
      currentCensusField,
      msa,
    });

    // hideAverageLine({
    //   nationalAverageGroup,
    // });

    d3.select('.footer__histogram')
      .classed('histogram--empty', histogramData.length === 0);
  },
};

export default updateFunctions;
