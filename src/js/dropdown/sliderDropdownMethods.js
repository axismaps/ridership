import Slider from '../slider/sliderRange';

const sliderPureMethods = {
  getSlider({
    contentContainer,
    yearRange,
    years,
    updateYears,
  }) {
    const width = 200;
    const height = 24;
    // const svg = contentContainer.append('svg')
    //   .styles({
    //     width: `${width}px`,
    //     height: `${height}px`,
    //   });

    const slider = new Slider({
      container: contentContainer,
      size: {
        width,
        height,
      },
      handleSize: {
        width: 16,
        height,
      },
      padding: {
        left: 0,
        right: 0,
      },
      // svg,
      valueRange: yearRange,
      currentValues: years,
      onDragEnd: updateYears,
      trackHeight: 7,
    });
    return slider;
  },

  getMobileModal({
    toggleButton,
    yearRange,
    years,
    updateYears,
  }) {
    const modal = toggleButton.select('.mobile-modal');
    const startSelect = modal.select('select.atlas__year-start');
    const endSelect = modal.select('select.atlas__year-end');

    startSelect.selectAll('option')
      .data(d3.range.apply(null, yearRange).slice(0, -1))
      .enter()
      .append('option')
      .attr('value', d => d)
      .html(d => d);

    endSelect.selectAll('option')
      .data(d3.range.apply(null, yearRange).slice(1))
      .enter()
      .append('option')
      .attr('value', d => d)
      .html(d => d);

    const startNode = startSelect.node();
    const endNode = endSelect.node();

    function yearChange() {
      const start = startSelect.node().value;
      const end = endSelect.node().value;
      const min = Math.min(start, end);
      const max = start === end ? min + 1 : Math.max(start, end);

      startNode.value = min;
      endNode.value = max;
      updateYears([min, max]);
      // modal.classed('open', false);
    }

    startSelect.on('change', yearChange);
    endSelect.on('change', yearChange);

    [startNode.value, endNode.value] = years;

    toggleButton.on('touchend', () => {
      d3.event.stopPropagation();
      modal.classed('open', true);
    });

    modal.selectAll('.modal-close, .mobile-done').on('touchend', () => {
      d3.event.stopPropagation();
      modal.classed('open', false);
    });

    return modal;
  },
};

export default sliderPureMethods;
