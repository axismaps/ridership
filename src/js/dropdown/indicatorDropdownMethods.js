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

    const groupedIndicators = Object.entries(indicatorList.reduce((groups, indicator) => {
      const groupsCopy = { ...groups };
      const key = indicator.parent || indicator.text;
      if (!groupsCopy[key]) groupsCopy[key] = [];
      groupsCopy[key].push(indicator);
      return groupsCopy;
    }, {}));

    if (!censusFields) {
      if (groupedIndicators.every(d => d[1].length === 1)) {
        // normal ol dropdown, e.g. distance filter menu
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
          .html(d => `${d.verified ? ' <i class="fa fa-badge-check" title="High confidence"></i>' : ' <i class="fa fa-fw"></i>'}${d.text}`);
      } else {
        // groups indicators with different transit modes
        indicatorRows = contentContainer
          .selectAll('.grouped-dropdown__content-row')
          .data(groupedIndicators)
          .enter()
          .append('div')
          .attrs({
            class: 'grouped-dropdown__content-row',
          });

        // note d[1][0] below = first indicator in the group
        indicatorRows
          .append('div')
          .attr('class', 'grouped-dropdown__content-row__title')
          .html(d => `${d[1][0].text}${d[1][0].verified ? ' <i class="fa fa-badge-check"></i>' : ''}${d[1].length > 1 ? ':' : ''}`)
          .on('mouseover', function showProbe(d) {
            dataProbe.remove();
            if (!d.meta) return;
            const rect = this.getBoundingClientRect();
            const pos = {
              right: window.innerWidth - rect.x + 25,
              bottom: window.innerHeight - rect.bottom,
              width: 250,
            };
            const html = `${d[1][0].meta}${d[1][0].verified ? '<br><br><i class="fa fa-badge-check"></i> High confidence' : ''}`;
            dataProbe
              .config({
                pos,
                html,
              })
              .draw();
          })
          .on('mouseout', () => { dataProbe.remove(); })
          .on('click', d => updateIndicator(d[1][0]));

        indicatorRows.selectAll('div.grouped-dropdown__content-row__indicator')
          .data(d => d[1])
          .enter()
          .append('div')
          .attr('class', 'grouped-dropdown__content-row__indicator')
          .classed('hidden', d => d.parent === undefined) // there is nothing else in the group
          .text(ind => ind.mode || 'All modes')
          .on('click', updateIndicator);
      }
    } else {
      // census indicators, grouped with single year and change
      // TO DO: this menu and main indicators (above) ought to just be done in the same way
      indicatorRows = contentContainer
        .selectAll('.grouped-dropdown__content-row')
        .data(censusFields)
        .enter()
        .append('div')
        .attrs({
          class: 'grouped-dropdown__content-row',
        });

      indicatorRows
        .append('div')
        .attr('class', 'grouped-dropdown__content-row__title')
        .html(d => `${d.text}${d.verified ? ' <i class="fa fa-badge-check"></i>' : ''}:`)
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
        .attr('class', 'grouped-dropdown__content-row__indicator')
        .text('Single year')
        .on('click', updateIndicator);

      indicatorRows
        .append('div')
        .datum((d, i) => indicators[i * 2 + 1])
        .attr('class', 'grouped-dropdown__content-row__indicator')
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
        .classed('indicator-dropdown__content-row--highlighted', (d) => {
          if (d.id !== undefined) {
            // 'id' prop for indicators
            return (indicator === null ? false : d.id === indicator.id);
          }
          // 'value' prop for other things, like distance dropdown
          return (indicator === null ? false : d.value === indicator.value);
        });
    } else {
      indicatorRows
        .classed('grouped-dropdown__content-row--highlighted', d => (indicator === null ? false : d.value === indicator.value));
      indicatorRows.selectAll('.grouped-dropdown__content-row__indicator')
        .classed('grouped-dropdown__content-row__indicator--highlighted', d => (indicator === null ? false : d.id === indicator.id));
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
