const headerButtonMethods = {
  assembleExport({
    atlasImage,
    sidebarImage,
    histogramImage,
  }) {
    const canvasNode = document.createElement('canvas');
    const margin = 20;
    canvasNode.width = Math.max(atlasImage.width, histogramImage.width) + 2 * margin;
    canvasNode.height = atlasImage.height + histogramImage.height + 3 * margin;
    const ctx = canvasNode.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvasNode.width, canvasNode.height);
    ctx.drawImage(atlasImage, margin, margin);
    ctx.drawImage(histogramImage, margin, atlasImage.height + margin);
    const link = document.createElement('a');
    link.download = 'TransitCenterRidershipVisualization.png';
    link.href = canvasNode.toDataURL('image/png;base64');

    // https://codepen.io/joseluisq/pen/mnkLu
    if (document.createEvent) {
      const e = document.createEvent('MouseEvents');
      e.initMouseEvent('click', true, true, window,
        0, 0, 0, 0, 0, false, false, false,
        false, 0, null);

      link.dispatchEvent(e);
    } else if (link.fireEvent) {
      link.fireEvent('onclick');
    }

    return canvasNode;
  },
};

export default headerButtonMethods;
