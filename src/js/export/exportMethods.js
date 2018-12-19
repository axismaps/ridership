const exportMehods = {
  SVGtoCanvas({
    svgNode,
  }) {
    d3.select(svgNode).selectAll('path, circle, rect')
      .each(function addInline() {
        const style = window.getComputedStyle(this);
        const { fill, stroke } = style;
        d3.select(this).styles({
          fill,
          stroke,
        });
      });

    return new Promise((resolve) => {
      const canvas = d3.select('body').append('canvas')
        .style('display', 'none')
        .node();
      const bbox = svgNode.getBoundingClientRect();
      const {
        width,
        height,
      } = bbox;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
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
        resolve(canvas);
      };
    });
  },
};

export default exportMehods;
