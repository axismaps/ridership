const localFunctions = {
  getCircleDistanceFromBottom({
    height,
  }) {
    return height / 2;
  },
};

const legendFunctions = {
  drawSVG({
    container,
    width,
    height,
  }) {
    return container
      .append('svg')
      .styles({
        width: `${width}px`,
        height: `${height}px`,
      });
  },
  drawCircles({
    svg,
    width,
    height,
    radiusScale,
  }) {
    const {
      getCircleDistanceFromBottom,
    } = localFunctions;
    const circleData = [
      // 25000,
      500000000,
      2000000000,
      5000000000,
    ];
    const fromBottom = getCircleDistanceFromBottom({ height });
    const circleGroups = svg.selectAll('.legend__circle-group')
      .data(circleData)
      .enter()
      .append('g')
      .attrs({
        class: 'legend__circle-group',
        transform: d => `translate(${width / 2},${height - radiusScale(d) - fromBottom})`,
      });

    circleGroups
      .append('circle')
      .attrs({
        class: 'legend__circle',
        cx: 0,
        cy: 0,
        r: d => radiusScale(d),
      });
    const format = d3.format(',');
    circleGroups
      .append('text')
      .attrs({
        class: 'legend__label',
        x: 0,
        y: (d, i) => {
          const offset = 8;
          if (i === 0) return offset;
          return offset - radiusScale(circleData[i - 1]);
        },
        'text-anchor': 'middle',
      })
      .text(d => `${format(d / 1000000)}M`);
  },
  drawDescription({
    container,
    height,
    width,
  }) {
    const {
      getCircleDistanceFromBottom,
    } = localFunctions;
    const fromTop = height - getCircleDistanceFromBottom({ height });
    container
      .append('div')
      .attr('class', 'legend__description-container')
      .styles({
        width: `${width}px`,
        height: `${height}px`,
        position: 'absolute',
        left: '0px',
        top: `${fromTop}px`,
      })
      .append('div')
      .attr('class', 'legend__description')
      .text('Millions of unlinked passenger trips (UPT)');
  },
};

export default legendFunctions;
