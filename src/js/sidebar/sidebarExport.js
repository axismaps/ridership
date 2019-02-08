const getExport = ({
  privateProps,
  privateMethods,
}) => function sidebarExport() {
  const {
    exportMethods,
    sparkRows,
    sidebarView,
    pcpContainer,
    legendContainer,
    compareContainer,
    yearRange,
  } = privateProps.get(this);

  const {
    getMutlilineText,
  } = privateMethods;

  const { SVGtoCanvas } = exportMethods;

  const graphicsCanvas = document.createElement('canvas');
  const legendCanvas = document.createElement('canvas');
  legendCanvas.width = 420;
  const legendCtx = legendCanvas.getContext('2d');
  const sparklinesLegendRows = legendContainer.selectAll('.sidebar__sparkline-legend-row');
  const compareRows = compareContainer.selectAll('.sidebar__compare-row');
  let legendHeight = 0;
  if (sparklinesLegendRows.size() > 0) {
    legendCanvas.height = legendContainer.node().offsetHeight;
    legendCtx.font = '15px Mark, Arial, sans-serif';
    legendCtx.textBaseline = 'bottom';
    sparklinesLegendRows.each((d) => {
      legendCtx.fillStyle = d.color;
      legendCtx.fillRect(0, legendHeight + 3, 12, 12);

      const lines = getMutlilineText({
        text: d.taName,
        maxWidth: 200,
        ctx: legendCtx,
      });
      legendCtx.fillStyle = '#666';
      lines.forEach((line) => {
        legendHeight += 18;
        legendCtx.fillText(line, 32, legendHeight);
      });
    });
  } else if (compareRows.size() > 0) {
    legendCanvas.height = compareRows.size() * 18;
    legendCtx.font = '15px Mark, Arial, sans-serif';
    legendCtx.textBaseline = 'bottom';
    legendCtx.fillStyle = '#666';
    legendHeight = 18;
    legendCtx.fillText('Comparing:', 0, legendHeight);
    compareRows.each((d) => {
      const lines = getMutlilineText({
        text: d.name || d.taName,
        maxWidth: legendCanvas.width - 40,
        ctx: legendCtx,
      });
      lines.forEach((line) => {
        legendHeight += 18;
        legendCtx.fillText(line, 20, legendHeight);
      });
    });
  } else {
    legendCanvas.height = 1;
  }

  if (sidebarView === 'sparkLines') {
    const promises = [];
    sparkRows.each(function exportSparkline() {
      const svgNode = d3.select(this).select('svg').node();
      const title = d3.select(this).select('.sidebar__sparkline-title');
      promises.push(new Promise((resolve) => {
        SVGtoCanvas({ svgNode })
          .then((canvas) => {
            const rowCanvas = document.createElement('canvas');
            rowCanvas.width = 420;
            rowCanvas.height = canvas.height;
            const ctx = rowCanvas.getContext('2d');
            ctx.drawImage(canvas, rowCanvas.width - canvas.width, 0);
            if (title.classed('sidebar__sparkline-title--selected')) {
              ctx.font = 'bold 15px Mark, Arial, sans-serif';
              ctx.fillStyle = '#2D74ED';
            } else {
              ctx.font = '15px Mark, Arial, sans-serif';
              ctx.fillStyle = '#666';
            }
            ctx.textBaseline = 'middle';

            const lines = getMutlilineText({
              text: title.text(),
              maxWidth: rowCanvas.width - canvas.width - 15,
              ctx,
            });

            lines.forEach((line, i) => {
              const y = rowCanvas.height / 2 - (9 * lines.length / 2) + i * 18;
              ctx.fillText(line, 0, y);
            });

            resolve(rowCanvas);
          });
      }));
    });

    graphicsCanvas.width = 420;
    const ctx = graphicsCanvas.getContext('2d');

    return Promise.all(promises).then((results) => {
      const graphicsHeight = results.reduce((height, rowCanvas) => rowCanvas.height + height, 0);
      graphicsCanvas.height = graphicsHeight + 20;
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1;
      ctx.moveTo(graphicsCanvas.width - 190, 15);
      ctx.lineTo(graphicsCanvas.width - 190, 25);
      ctx.moveTo(graphicsCanvas.width - 10, 15);
      ctx.lineTo(graphicsCanvas.width - 10, 25);
      ctx.stroke();
      ctx.font = '12px Mark, Arial, sans-serif';
      ctx.fillStyle = '#666';
      ctx.textBaseline = 'bottom';
      ctx.fillText(yearRange[0], graphicsCanvas.width - 190, 15);
      ctx.textAlign = 'right';
      ctx.fillText(yearRange[1], graphicsCanvas.width - 10, 15);
      let y = 0;
      results.forEach((rowCanvas) => {
        ctx.drawImage(rowCanvas, 0, y + 20);
        y += rowCanvas.height;
      });
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = graphicsCanvas.width + 40;
      finalCanvas.height = legendCanvas.height + graphicsCanvas.height + 40;
      const finalCtx = finalCanvas.getContext('2d');
      finalCtx.drawImage(legendCanvas, 20, 20);
      finalCtx.drawImage(graphicsCanvas, 20, 20 + legendHeight);
      return Promise.resolve(finalCanvas);
    });
  }

  const svgNode = pcpContainer.select('svg').node();
  return SVGtoCanvas({ svgNode }).then((canvas) => {
    const headerHeight = 20;
    graphicsCanvas.width = 420;
    graphicsCanvas.height = canvas.height + headerHeight;
    const ctx = graphicsCanvas.getContext('2d');
    ctx.drawImage(canvas, graphicsCanvas.width - canvas.width - 15, headerHeight);
    ctx.textBaseline = 'middle';
    ctx.font = '12px Mark, Arial, sans-serif';
    ctx.fillStyle = '#666';
    ctx.textAlign = 'center';
    ctx.fillText(d3.select('.sidebar__pcp-header').text(), graphicsCanvas.width - 0.5 * canvas.width, 18);
    ctx.textAlign = 'left';
    pcpContainer.selectAll('.sidebar__pcp-row').each(function drawTitle(d, row) {
      if (d3.select(this).classed('sidebar__pcp-row--selected')) {
        ctx.font = 'bold 15px Mark, Arial, sans-serif';
        ctx.fillStyle = '#2D74ED';
      } else {
        ctx.font = '15px Mark, Arial, sans-serif';
        ctx.fillStyle = '#666';
      }
      const lines = getMutlilineText({
        text: d3.select(this).select('p').text(),
        maxWidth: 180,
        ctx,
      });
      lines.forEach((line, i) => {
        const y = headerHeight + 30 - (9 * lines.length / 2) + i * 18 + row * 60;
        ctx.fillText(line, 0, y);
      });
    });
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = graphicsCanvas.width + 40;
    finalCanvas.height = legendCanvas.height + graphicsCanvas.height + 40;
    const finalCtx = finalCanvas.getContext('2d');
    finalCtx.drawImage(legendCanvas, 20, 20);
    finalCtx.drawImage(graphicsCanvas, 20, 20 + legendHeight);
    return Promise.resolve(finalCanvas);
  });
};

export default getExport;
