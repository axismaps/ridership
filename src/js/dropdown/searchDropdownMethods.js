const pureMethods = {
  drawInput({
    toggleButton,
    contentOuterContainer,
  }) {
    const searchInput = toggleButton.append('input')
      .attr('placeholder', 'Agency name...');

    const outerContainer = d3.select('.outer-container');

    toggleButton.on('click', () => {
      d3.event.stopPropagation();
      if (outerContainer.classed('searched')) {
        return;
      }
      if (!toggleButton.classed('active')) {
        outerContainer.classed('search-active', true);
        d3.select('body').on('click.search keydown.search', () => {
          if (d3.event.keyCode && d3.event.keyCode !== 27) return;
          outerContainer.classed('search-active', false);
          d3.select('body').on('click.search keydown.search', null);
          contentOuterContainer
            .classed('dropdown-content--open', false);
          const node = toggleButton.select('input').node();
          node.value = '';
        });
        toggleButton.select('input')
          .node().focus();
      }
    });
    return searchInput;
  },

  setSearchEvent({
    searchInput,
    allNationalMapData,
    contentContainer,
    contentOuterContainer,
    nationalDataView,
    updateSearchResult,
  }) {
    const { doSearch } = pureMethods;

    searchInput
      .on('keyup', function onSearch() {
        if (d3.event.keyCode === 27) return;
        const { value } = this;
        const results = doSearch({
          value,
          allNationalMapData,
          nationalDataView,
        });

        contentOuterContainer
          .classed('dropdown-content--open', true);

        const rows = contentContainer.selectAll('.search-dropdown__content-row')
          .data(results, d => (d === undefined ? null : d.globalId));

        rows.enter()
          .append('div')
          .attr('class', 'search-dropdown__content-row')
          .html(d => `<i class="fas fa-binoculars"></i> ${d.name || d.taName}`)
          .on('mousedown', () => {
            d3.event.stopPropagation();
          })
          .on('click', (d) => {
            // select result
            // show selected entity in button
            updateSearchResult(d);
            d3.select('.outer-container').classed('search-active', false);
            d3.select('body').on('click.search keydown.search', null);
            contentOuterContainer
              .classed('dropdown-content--open', false);
            const node = searchInput.node();
            node.value = '';
          });

        rows.exit()
          .remove();

        if (results.length === 0) {
          contentContainer.append('div')
            .attr('class', 'search-dropdown__content-row')
            .text('No results');
        }

        const {
          left,
          top,
          height,
        } = searchInput.node().getBoundingClientRect();

        const menuMargin = 10;

        contentOuterContainer
          .styles({
            position: 'absolute',
            top: `${top + height + menuMargin}px`,
          });

        contentOuterContainer
          .styles({
            left: `${left}px`,
          });
      });
  },

  doSearch({
    value,
    allNationalMapData,
    nationalDataView,

  }) {
    if (nationalDataView === 'msa') {
      return allNationalMapData.filter(msa => msa.name.toLowerCase().includes(value))
        .sort((a, b) => {
          if (a.name < b.name) { return -1; }
          if (a.name > b.name) { return 1; }
          return 0;
        });
    }
    return allNationalMapData
      .map(msa => msa.ta)
      .reduce((accumulator, ta) => [...accumulator, ...ta], [])
      .filter(ta => ta.taName.toLowerCase().includes(value))
      .sort((a, b) => {
        if (a.taName < b.taName) { return -1; }
        if (a.taName > b.taName) { return 1; }
        return 0;
      });
  },

  setButtonText({
    toggleButton,
    searchResult,
  }) {
    if (searchResult === null) return;
    toggleButton.select('.atlas__search-dropdown-result-text').text(searchResult.name || searchResult.taName);
  },

};

export default pureMethods;
