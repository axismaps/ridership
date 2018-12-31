import ZoomControls from '../zoomControls/zoomControls';

const getZoomControls = ({ state, components }) => new ZoomControls({
  zoomInButton: d3.select('.atlas__zoom-in'),
  zoomOutButton: d3.select('.atlas__zoom-out'),
  onZoomIn() {
    console.log('zoom in');
  },
  onZoomOut() {
    console.log('zoom out');
  },
  currentZoom: state.get('currentZoom'),
  currentScale: state.get('scale'),
});

export default getZoomControls;
