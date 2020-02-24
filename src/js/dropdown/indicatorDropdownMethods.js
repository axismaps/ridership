const pureMethods = {
  drawContent({
    indicators,
    contentContainer,
    updateIndicator,
    dataProbe,
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
      .on('mouseover', function showProbe(d) {
        dataProbe.remove();
        if (!d.meta) return;
        const rect = this.getBoundingClientRect();
        const pos = {
          right: window.innerWidth - rect.x + 25,
          bottom: window.innerHeight - rect.bottom,
          width: 250,
        };
        const html = d.meta;
        dataProbe
          .config({
            pos,
            html,
          })
          .draw();
      })
      .on('mouseout', () => {
        dataProbe.remove();
      })
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
    infoButton,
    dataProbe,
  }) {
    toggleButtonText.text(indicator !== null ? indicator.text : defaultText);
    if (!infoButton) return;
    infoButton.on('mouseover', function showProbe() {
      dataProbe.remove();
      if (!indicator.meta) return;
      const rect = this.getBoundingClientRect();
      const pos = {
        right: window.innerWidth - rect.x + 25,
        bottom: window.innerHeight - rect.bottom,
        width: 250,
      };
      const html = indicator.meta;
      dataProbe
        .config({
          pos,
          html,
        })
        .draw();
    })
      .on('mouseout', () => {
        dataProbe.remove();
      });
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
