const pureMethods = {
  drawContent({
    indicators,
    contentContainer,
  }) {
    const indicatorList = Array.from(indicators.values());

    contentContainer
      .selectAll('.indicator-dropdown__content-row')
      .data(indicatorList)
      .enter()
      .append('div')
      .attrs({
        class: 'indicator-dropdown__content-row',
      })
      .text(d => d.text);
  },
  setContentPosition({
    toggleButton,
    contentOuterContainer,
  }) {
    const {
      left,
      top,
      height,
    } = toggleButton.node().getBoundingClientRect();

    const menuMargin = 10;

    contentOuterContainer
      .styles({
        position: 'absolute',
        left: `${left}px`,
        top: `${top + height + menuMargin}px`,
      });
  },
  setButtonText({
    indicator,
    toggleButtonText,
  }) {
    toggleButtonText.text(indicator.text);
  },
};

export default pureMethods;
