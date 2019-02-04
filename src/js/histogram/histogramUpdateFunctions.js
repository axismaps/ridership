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
    changeColorScale,
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
        fill: d => changeColorScale((d.bucket[1] + d.bucket[0]) / 2),
        stroke: '#999999',
        'stroke-width': 1,
      });
  },

  updateNational({
    bars,
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
  }) {
    const {

      getScales,

      addNationalBarMouseEvents,
    } = histogramFunctions;

    const {
      updateBars,
      updateAxes,
      updateAverageLine,
    } = updateFunctions;

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
      height,
    });

    updateBars({
      height,
      padding,
      bars,
      histogramData,
      yScale,
      changeColorScale,
      updateHighlightedAgencies,
      dataProbe,
    });

    addNationalBarMouseEvents({
      bars,
      updateHighlightedAgencies,
      dataProbe,
      nationalDataView,
    });

    updateAverageLine({
      nationalAverageGroup,
      nationalAverage,
      nationalAverageText,
      xScale,
      padding,
    });
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
    const xText = isNational
      ? `${currentIndicator.text} (% change, ${years[0]}-${years[1]})`
      : `${currentCensusField.text} (% change, ${years[0]}-${years[1]})`;

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
    bars,
    nationalAverageGroup,
    changeColorScale,
    dataProbe,
    histogramData,
    updateHighlightedTracts,
  }) {
    const {
      // getMSAHistogramData,
      getScales,

      hideAverageLine,
      addMSABarMouseEvents,
    } = histogramFunctions;

    const {
      updateAxes,
      updateBars,
    } = updateFunctions;

    const { yScale, xScale } = getScales({
      padding,
      histogramData,
      width,
      height,
    });

    updateAxes({
      padding,
      xScale,
      yScale,
      xAxis,
      yAxis,
      height,
    });

    updateBars({
      bars,
      histogramData,
      yScale,
      changeColorScale,
      height,
      padding,
    });

    addMSABarMouseEvents({
      bars,
      dataProbe,
      updateHighlightedTracts,
    });

    hideAverageLine({
      nationalAverageGroup,
    });
  },
};

export default updateFunctions;
