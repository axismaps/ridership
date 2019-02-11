const getExport = ({ privateProps }) => function exportHistogram() {
  const {
    exportMethods,
    svg,
    container,
    xAxisLabel,
    yAxisLabel,
  } = privateProps.get(this);

  const svgNode = svg.node();
  const { SVGtoCanvas } = exportMethods;

  return SVGtoCanvas({ svgNode })
    .then((canvas) => {
      const bbox = container.node().getBoundingClientRect();
      const {
        width,
        height,
      } = bbox;
      const fullCanvas = document.createElement('canvas');
      fullCanvas.width = width;
      fullCanvas.height = height;
      const ctx = fullCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, 0);
      ctx.fillStyle = '#000';
      ctx.font = 'normal normal 300 12px Mark, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';

      const yWords = yAxisLabel.text().split(' ');
      const lines = [];
      yWords.forEach((word) => {
        if (lines.length === 0) {
          lines.push(word);
        } else {
          const newLine = `${lines[lines.length - 1]} ${word}`;
          if (ctx.measureText(newLine).width > 100 && newLine.includes(' ')) {
            lines.push(word);
          } else {
            lines[lines.length - 1] = newLine;
          }
        }
      });

      lines.forEach((line, i) => {
        const yOffset = lines.length - i * 15;
        ctx.save();
        ctx.translate(45 - yOffset, 75);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(line, 0, 0);
        ctx.restore();
      });

      ctx.fillText(xAxisLabel.text(), width / 2, height - 15);

      return Promise.resolve(fullCanvas);
    });
};

export default getExport;
