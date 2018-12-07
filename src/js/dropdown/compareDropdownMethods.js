const pureMethods = {
  drawContent({
    nationalMapData,
    contentContainer,
    updateComparedAgencies,
  }) {
    const agenciesByRidership = nationalMapData.map(msa => msa.ta)
      .reduce((accumulator, ta) => [...accumulator, ...ta], [])
      .sort((a, b) => b.ntd[b.ntd.length - 1].upt - a.ntd[a.ntd.length - 1].upt)
      .slice(0, 10);

    const compareList = [
      {
        text: 'Top 10 agencies by ridership',
        data: agenciesByRidership,
      },
    ];

    const compareRows = contentContainer
      .selectAll('.compare-dropdown__content-row')
      .data(compareList)
      .enter()
      .append('div')
      .attrs({
        class: 'compare-dropdown__content-row',
      })
      .text(d => d.text)
      .on('click', d => updateComparedAgencies(d.data));

    return compareRows;
  },

  setButtonText({
    toggleButtonText,
  }) {
    toggleButtonText.text('Compare');
  },

  highlightCurrent({
    compareRows,
    comparedAgencies,
  }) {
    compareRows
      .classed('compare-dropdown__content-row--highlighted', (d) => {
        let matches = d.data.length === comparedAgencies.length;
        if (matches) {
          d.data.forEach((ta, i) => {
            if (comparedAgencies[i].taId !== ta.taId) matches = false;
          });
        }
        return matches;
      });
  },

};

export default pureMethods;
