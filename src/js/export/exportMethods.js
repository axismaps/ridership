const exportMehods = {
  SVGtoCanvas({
    svgNode,
  }) {
    const bbox = svgNode.getBoundingClientRect();
    const {
      width,
      height,
    } = bbox;
    d3.select(svgNode)
      .attrs({
        width,
        height,
      })
      .selectAll('path, circle, rect, line, text')
      .each(function addInline() {
        const style = window.getComputedStyle(this);
        const {
          fill, stroke, fontFamily, fontSize, fontStyle, fontWeight, display,
        } = style;
        d3.select(this).styles({
          fill,
          stroke,
          display,
          'font-family': fontFamily,
          'font-weight': fontWeight,
          'font-size': fontSize,
          'font-style': fontStyle,
        });
      });

    return new Promise((resolve) => {
      const canvasNode = document.createElement('canvas');
      canvasNode.width = width;
      canvasNode.height = height;
      const ctx = canvasNode.getContext('2d');
      const DOMURL = window.URL || window.webkitURL || window;
      const svgString = new XMLSerializer().serializeToString(svgNode);
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });
      const url = DOMURL.createObjectURL(svgBlob);
      img.src = url;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        DOMURL.revokeObjectURL(url);
        resolve(canvasNode);
      };
    });
  },
};

export default exportMehods;
