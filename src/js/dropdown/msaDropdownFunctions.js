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
    mobileSelect,
  }) {
    msaRows
      .classed('msa-dropdown__content-row--highlighted', d => (currentMSA === null
        ? d.msaId === 'average'
        : currentMSA.msaId === d.msaId));

    const selectNode = mobileSelect.node();
    selectNode.value = currentMSA === null ? null : currentMSA.msaId;
  },
  setButtonText({
    toggleButton,
    currentMSA,
  }) {
    toggleButton
      .text(currentMSA === null ? 'National Average' : currentMSA.name);
  },

  drawMobileContent({
    msaList,
    mobileSelect,
    updateMSA,
  }) {
    mobileSelect
      .selectAll('option')
      .data(msaList)
      .enter()
      .append('option')
      .attr('value', d => d.msaId)
      .html(d => d.name);

    return mobileSelect.on('change', function onChange() {
      updateMSA(msaList.find(d => d.msaId === this.value));
    });
  },
};

export default msaDropdownFunctions;
