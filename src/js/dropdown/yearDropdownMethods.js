const pureMethods = {
  drawContent({
    yearRange,
    contentContainer,
    updateYear,
  }) {
    const yearList = d3.range(yearRange[0], yearRange[1] + 1);

    const yearRows = contentContainer
      .selectAll('.indicator-dropdown__content-row')
      .data(yearList)
      .enter()
      .append('div')
      .attrs({
        class: 'indicator-dropdown__content-row',
      })
      .text(d => d)
      .on('click', updateYear);

    return yearRows;
  },

  drawMobileContent({
    years,
    yearRange,
    toggleButton,
    updateYear,
  }) {
    const yearList = d3.range(yearRange[0], yearRange[1]);

    const dropdown = toggleButton.select('select');

    dropdown.selectAll('option')
      .data(yearList)
      .enter()
      .append('option')
      .html(d => d)
      .attr('value', d => d)
      .attr('selected', d => d === years[1]);

    return dropdown
      .on('change', function dropdownChange() {
        const { value } = this;
        updateYear(value);
      });
  },

  setButtonText({
    years,
    toggleButtonText,
  }) {
    toggleButtonText.text(years[1]);
  },
  highlightCurrentYear({
    yearRows,
    years,
    mobileSelect,
  }) {
    yearRows
      .classed('indicator-dropdown__content-row--highlighted', d => d === years[1]);
    if (mobileSelect.size()) {
      const selectNode = mobileSelect.node();
      const year = years[1];
      selectNode.value = year;
      mobileSelect
        .selectAll('option')
        .attr('selected', d => d === years[1]);
    }
  },
};

export default pureMethods;
