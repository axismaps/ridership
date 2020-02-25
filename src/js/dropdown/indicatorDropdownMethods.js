const pureMethods = {
  drawContent({
    indicators,
    contentContainer,
    updateIndicator,
    dataProbe,
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
        .on('mouseover', function showProbe(d) {
          dataProbe.remove();
          if (!d.meta) return;
          const rect = this.getBoundingClientRect();
          const pos = {
            right: window.innerWidth - rect.x + 25,
            bottom: window.innerHeight - rect.bottom,
            width: 250,
          };
          const html = `${d.meta}${d.verified ? '<br><br><i class="fa fa-badge-check"></i> High confidence' : ''}`;
          dataProbe
            .config({
              pos,
              html,
            })
            .draw();
        })
        .on('click', updateIndicator)
        .on('mouseout', () => { dataProbe.remove(); });

      indicatorRows
        .append('span')
        .html(d => d.text);
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
        .text(d => `${d.text}:`)
        .on('mouseover', function showProbe(d) {
          dataProbe.remove();
          if (!d.meta) return;
          const rect = this.getBoundingClientRect();
          const pos = {
            right: window.innerWidth - rect.x + 25,
            bottom: window.innerHeight - rect.bottom,
            width: 250,
          };
          const html = `${d.meta}${d.verified ? '<br><br><i class="fa fa-badge-check"></i> High confidence' : ''}`;
          dataProbe
            .config({
              pos,
              html,
            })
            .draw();
        })
        .on('mouseout', () => { dataProbe.remove(); });

      indicatorRows
        .append('div')
        .datum((d, i) => indicators[i * 2])
        .attr('class', 'census-dropdown__content-row__indicator')
        .text('Single year')
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
      .attr('value', d => d.id)
      .attr('selected', d => (indicator === null ? false : d.id === indicator.id));

    return dropdown
      .on('change', function dropdownChange() {
        const { value } = this;
        const selectedIndicator = indicatorList.find(i => i.id === value);
        console.log(indicatorList, value);
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
      selectNode.value = indicator === null ? null : indicator.id;
      mobileSelect
        .selectAll('option')
        .attr('selected', d => (indicator === null ? false : d.id === indicator.id));
    }
  },
};

export default pureMethods;
