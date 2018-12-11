const pureMethods = {
  drawContent({
    nationalMapData,
    contentContainer,
    updateComparedAgencies,
    updateNationalDataView,
    updateCompareMode,
  }) {
    const agenciesByRidership = nationalMapData.map(msa => msa.ta)
      .reduce((accumulator, ta) => [...accumulator, ...ta], [])
      .sort((a, b) => b.ntd[b.ntd.length - 1].upt - a.ntd[a.ntd.length - 1].upt)
      .slice(0, 10);

    // for the moment, this is actually MSAs by ridership
    const msaByPop = nationalMapData.map((msa) => {
      const msaCopy = Object.assign({}, msa);
      msaCopy.population = d3.sum(msa.ta, ta => ta.ntd[ta.ntd.length - 1].upt);
      return msaCopy;
    })
      .sort((a, b) => b.population - a.population)
      .slice(0, 10);

    const compareList = [
      {
        text: 'Top 10 agencies by ridership',
        data: agenciesByRidership,
        nationalDataView: 'ta',
      },
      {
        text: 'Top 10 MSAs by population',
        data: msaByPop,
        nationalDataView: 'msa',
      },
    ];

    const compareRows = contentContainer
      .selectAll('.compare-dropdown__content-row')
      .data(compareList);
    const newRows = compareRows
      .enter()
      .append('div')
      .attrs({
        class: 'compare-dropdown__content-row',
      })
      .text(d => d.text);

    newRows.merge(compareRows)
      .on('click', (d) => {
        updateNationalDataView(d.nationalDataView);
        updateComparedAgencies(d.data);
      });

    contentContainer.append('div')
      .datum({ data: [] })
      .attrs({
        class: 'compare-dropdown__content-row',
      })
      .html('<i class="fa fa-mouse-pointer"></i> Select your own')
      .on('click', () => {
        // activate manual compare mode
        updateCompareMode(true);
      });

    return contentContainer
      .selectAll('.compare-dropdown__content-row');
  },

  highlightCurrent({
    compareRows,
    comparedAgencies,
  }) {
    compareRows
      .classed('compare-dropdown__content-row--highlighted', (d) => {
        let matches = d.data.length === comparedAgencies.length && d.text !== undefined;
        if (matches) {
          d.data.forEach((ta, i) => {
            if (comparedAgencies[i].globalId !== ta.globalId) matches = false;
          });
        }
        return matches;
      });
  },

};

export default pureMethods;
