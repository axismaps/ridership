const headerButtonMethods = {
  assembleExport({
    atlasImage,
    sidebarImage,
    histogramImage,
    legendImage,
  }) {
    const canvasNode = document.createElement('canvas');
    const margin = 20;
    const headerHeight = 50;
    const graphicsY = margin + headerHeight;
    const sidebarHeight = sidebarImage.height;
    const atlasHistoHeight = atlasImage.height + histogramImage.height + margin;
    const atlasHistoWidth = Math.max(atlasImage.width, histogramImage.width);
    canvasNode.width = sidebarImage.width + atlasHistoWidth + 3 * margin;
    canvasNode.height = Math.max(sidebarHeight, atlasHistoHeight) + 2 * margin + headerHeight;
    const ctx = canvasNode.getContext('2d');
    ctx.fillStyle = '#DFE9FC';
    ctx.fillRect(0, 0, canvasNode.width, canvasNode.height);
    ctx.fillStyle = '#2D74ED';
    ctx.fillRect(0, 0, canvasNode.width, headerHeight);
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.font = '25px Mark, Arial, sans-serif';
    ctx.fillText('TransitCenter Transit Insights', margin, headerHeight / 2);
    ctx.fillStyle = '#fff';
    const whiteHeight = canvasNode.height - 2 * margin - headerHeight;
    ctx.fillRect(margin / 2, graphicsY, sidebarImage.width + margin / 2, whiteHeight);
    ctx.drawImage(sidebarImage, margin, graphicsY);
    const atlasX = sidebarImage.width + 2 * margin;
    ctx.fillRect(atlasX, graphicsY, atlasImage.width, whiteHeight);
    ctx.drawImage(atlasImage, atlasX, graphicsY);
    ctx.drawImage(histogramImage, atlasX, atlasImage.height + graphicsY);
    ctx.drawImage(legendImage, atlasX + histogramImage.width, atlasImage.height + graphicsY);
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
