import localFunctions from './histogramLocalFunctions';
import histogramFunctions from './histogramFunctions';

const updateFunctions = {
  updateAverageLine({
    nationalAverageGroup,
    nationalAverage,
    xScale,
    padding,
    nationalAverageText,
  }) {
    const {
      getNationalAverageText,
      getAverageLinePosition,
    } = localFunctions;

    nationalAverageText
      .text(getNationalAverageText({ nationalAverage }));

    nationalAverageGroup
      .style('opacity', 1)
      .transition()
      .duration(500)
      .attrs(getAverageLinePosition({
        padding,
        xScale,
        nationalAverage,
      }));

    nationalAverageGroup
      .select('text')
      .attr('x', Math.max(0, 70 - xScale(nationalAverage)));
  },
  updateAxes({
    xScale,
    yScale,
    xAxis,
    yAxis,
    height,
    padding,
    transition = 500,
  }) {
    const {
      getYAxisGenerator,
      getXAxisGenerator,
    } = localFunctions;

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
      .call(getXAxisGenerator({ xScale }));
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
  },
  updateMSA({
    padding,
    width,
    height,
    xAxis,
    yAxis,
    // bars,
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
  }) {
    const {
      // getMSAHistogramData,
      getColors,
      getScales,
      drawBars,
      hideAverageLine,
      addMSABarMouseEvents,
    } = histogramFunctions;

    const {
      updateAxes,
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

    hideAverageLine({
      nationalAverageGroup,
    });
  },
};

export default updateFunctions;
