const localFunctions = {
  getCircleDistanceFromBottom({
    height,
  }) {
    return height / 2;
  },
};

const legendFunctions = {
  getRadiusScale({ nationalMapData }) {
    const min = d3.min(nationalMapData, d => d.firstAndLast[1]);
    const mean = d3.mean(nationalMapData, d => d.firstAndLast[1]);

    const scale = d3.scaleSqrt()
      .domain([min, mean])
      .range([5, 12]);

    return scale;
  },
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
    indicator,
    nationalMapData,
  }) {
    const format = (val) => {
      const indicatorFormat = indicator.format;
      if (indicatorFormat === ',d') {
        if (val >= 1000000) return `${d3.format(',d')(val / 1000000)}M`;
        return d3.format(',d')(val);
      }
      return `${d3.format(indicatorFormat)(val)}${indicator.unit || ''}`;
    };
    const {
      getCircleDistanceFromBottom,
    } = localFunctions;
    const circleData = d3.ticks(...d3.extent(nationalMapData, d => d.firstAndLast[1]), 3);
    const fromBottom = getCircleDistanceFromBottom({ height });
    svg.selectAll('.legend__circle-group').remove();
    const widest = radiusScale(circleData[circleData.length - 1]);
    const circleGroups = svg.selectAll('.legend__circle-group')
      .data(circleData)
      .enter()
      .append('g')
      .attrs({
        class: 'legend__circle-group',
        transform: d => `translate(${2 + widest},${height - radiusScale(d) - fromBottom + radiusScale(circleData[0])})`,
      });

    circleGroups
      .append('circle')
      .attrs({
        class: 'legend__circle',
        cx: 0,
        cy: 0,
        r: d => radiusScale(d),
      });
    circleGroups
      .append('text')
      .attrs({
        class: 'legend__label',
        x: widest + 4,
        y: (d, i) => {
          const offset = 4;
          if (i === 0) return offset;
          return offset - radiusScale(d);
        },
        'text-anchor': 'left',
      })
      .text(d => format(d));

    circleGroups
      .append('line')
      .attrs({
        class: 'legend__line',
        x1: 0,
        x2: widest + 2,
        y1: (d, i) => {
          const offset = 0;
          if (i === 0) return offset;
          return offset - radiusScale(d);
        },
        y2: (d, i) => {
          const offset = 0;
          if (i === 0) return offset;
          return offset - radiusScale(d);
        },
      });
  },
  drawDescription({
    container,
    height,
    width,
    indicator,
    nationalMapData,
    radiusScale,
  }) {
    const circleData = d3.ticks(...d3.extent(nationalMapData, d => d.firstAndLast[1]), 3);
    const {
      getCircleDistanceFromBottom,
    } = localFunctions;
    const fromTop = height - getCircleDistanceFromBottom({ height }) + radiusScale(circleData[0]);
    container.select('.legend__description-container').remove();
    container
      .append('div')
      .attr('class', 'legend__description-container')
      .styles({
        width: `${width}px`,
        position: 'absolute',
        left: '0px',
        top: `${fromTop}px`,
      })
      .append('div')
      .attr('class', 'legend__description')
      .text(indicator.text);
  },
};

export default legendFunctions;
