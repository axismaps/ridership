const msaDropdownFunctions = {
  drawContent({
    msaList,
    contentContainer,
    updateMSA,
  }) {
    return contentContainer
      .selectAll('.msa-dropdown__content-row')
      .data(msaList)
      .enter()
      .append('div')
      .attr('class', 'msa-dropdown__content-row')
      .on('click', updateMSA)
      .text(d => d.name);
  },
  highlightCurrentMSA({
    currentMSA,
    msaRows,
  }) {
    msaRows
      .classed('msa-dropdown__content-row--highlighted', d => (currentMSA === null
        ? d.msaId === 'average'
        : currentMSA.msaId === d.msaId));
  },
  setButtonText({
    toggleButton,
    currentMSA,
  }) {
    toggleButton
      .text(currentMSA === null ? 'National Average' : currentMSA.name);
  },
};

export default msaDropdownFunctions;
