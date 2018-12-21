const headerButtonMethods = {
  assembleExport({
    atlasImage,
    sidebarImage,
    histogramImage,
    legendImage,
  }) {
    const canvasNode = document.createElement('canvas');
    const margin = 20;
    const sidebarHeight = sidebarImage.height;
    const atlasHistoHeight = atlasImage.height + histogramImage.height + margin;
    const atlasHistoWidth = Math.max(atlasImage.width, histogramImage.width);
    canvasNode.width = sidebarImage.width + atlasHistoWidth + 3 * margin;
    canvasNode.height = Math.max(sidebarHeight, atlasHistoHeight) + 2 * margin;
    const ctx = canvasNode.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvasNode.width, canvasNode.height);
    ctx.drawImage(sidebarImage, margin, margin);
    const atlasX = sidebarImage.width + 2 * margin;
    ctx.drawImage(atlasImage, atlasX, margin);
    ctx.drawImage(histogramImage, atlasX, atlasImage.height + margin);
    ctx.drawImage(legendImage, atlasX + histogramImage.width, atlasImage.height + margin);
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
