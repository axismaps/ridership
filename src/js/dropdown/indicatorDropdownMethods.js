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

  drawMobileContent({
    indicator,
    indicators,
    toggleButton,
    updateIndicator,
  }) {
    const indicatorList = Array.from(indicators.values());

    const dropdown = toggleButton.select('select');

    dropdown.selectAll('option')
      .data(indicatorList)
      .enter()
      .append('option')
      .html(d => d.text)
      .attr('value', d => d.value)
      .attr('selected', d => (indicator === null ? false : d.value === indicator.value));

    console.log(indicatorList);

    return dropdown
      .on('change', function dropdownChange() {
        const { value } = this;
        const selectedIndicator = indicatorList.find(i => i.value === value);
        updateIndicator(selectedIndicator);
      });
  },

  setButtonText({
    indicator,
    toggleButtonText,
    defaultText,
  }) {
    toggleButtonText.text(indicator !== null ? indicator.text : defaultText);
  },
  highlightCurrentIndicator({
    indicatorRows,
    mobileSelect,
    indicator,
  }) {
    indicatorRows
      .classed('indicator-dropdown__content-row--highlighted', d => (indicator === null ? false : d.value === indicator.value));
    if (mobileSelect.size()) {
      const selectNode = mobileSelect.node();
      selectNode.value = indicator === null ? null : indicator.value;
      mobileSelect
        .selectAll('option')
        .attr('selected', d => (indicator === null ? false : d.value === indicator.value));
    }
  },
};

export default pureMethods;
