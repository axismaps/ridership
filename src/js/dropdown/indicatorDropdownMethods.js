const pureMethods = {
  drawContent({
    indicators,
    contentContainer,
    updateIndicator,
  }) {
    const indicatorList = Array.from(indicators.values());

    const indicatorRows = contentContainer
      .selectAll('.indicator-dropdown__content-row')
      .data(indicatorList)
      .enter()
      .append('div')
      .attrs({
        class: 'indicator-dropdown__content-row',
      })
      .text(d => d.text)
      .on('click', updateIndicator);

    return indicatorRows;
  },

  setButtonText({
    indicator,
    toggleButtonText,
  }) {
    toggleButtonText.text(indicator.text);
  },
  highlightCurrentIndicator({
    indicatorRows,
    indicator,
  }) {
    indicatorRows
      .classed('indicator-dropdown__content-row--highlighted', d => d.value === indicator.value);
  },
};

export default pureMethods;
