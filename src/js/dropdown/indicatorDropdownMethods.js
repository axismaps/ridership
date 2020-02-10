const pureMethods = {
  drawContent({
    indicators,
    contentContainer,
    updateIndicator,
    censusFields,
  }) {
    const indicatorList = Array.from(indicators.values());

    let indicatorRows;

    if (!censusFields) {
      indicatorRows = contentContainer
        .selectAll('.indicator-dropdown__content-row')
        .data(indicatorList)
        .enter()
        .append('div')
        .attrs({
          class: 'indicator-dropdown__content-row',
        })
        .text(d => d.text)
        .on('click', updateIndicator);
    } else {
      indicatorRows = contentContainer
        .selectAll('.census-dropdown__content-row')
        .data(censusFields)
        .enter()
        .append('div')
        .attrs({
          class: 'census-dropdown__content-row',
        });

      indicatorRows
        .append('div')
        .attr('class', 'census-dropdown__content-row__title')
        .text(d => `${d.text}:`);

      indicatorRows
        .append('div')
        .datum((d, i) => indicators[i * 2])
        .attr('class', 'census-dropdown__content-row__indicator')
        .text('Nominal')
        .on('click', updateIndicator);

      indicatorRows
        .append('div')
        .datum((d, i) => indicators[i * 2 + 1])
        .attr('class', 'census-dropdown__content-row__indicator')
        .text('Change')
        .on('click', updateIndicator);
    }

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
    censusFields,
  }) {
    if (!censusFields) {
      indicatorRows
        .classed('indicator-dropdown__content-row--highlighted', d => (indicator === null ? false : d.id === indicator.id));
    } else {
      indicatorRows
        .classed('census-dropdown__content-row--highlighted', d => (indicator === null ? false : d.value === indicator.value));
      indicatorRows.selectAll('.census-dropdown__content-row__indicator')
        .classed('census-dropdown__content-row__indicator--highlighted', d => (indicator === null ? false : d.id === indicator.id));
    }
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
