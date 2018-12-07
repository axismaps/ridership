const pureMethods = {
  drawButtons({
    contentContainer,
    updateNationalDataView,
    nationalDataView,
  }) {
    const views = [
      {
        text: 'Transit Agency',
        value: 'ta',
      },
      {
        text: 'MSA',
        value: 'msa',
      },
    ];

    return contentContainer.selectAll('.header__data-view-button')
      .data(views)
      .enter()
      .append('div')
      .attr('class', 'header__data-view-button')
      .text(d => d.text)
      .on('click', d => updateNationalDataView(d.value))
      .classed('header__data-view-button--highlighted', d => nationalDataView === d.value);
  },

};

export default pureMethods;
