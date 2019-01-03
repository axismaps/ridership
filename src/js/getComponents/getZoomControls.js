import ZoomControls from '../zoomControls/zoomControls';

const getZoomControls = ({ state, data, components }) => new ZoomControls({
  zoomInButton: d3.select('.atlas__zoom-in'),
  zoomOutButton: d3.select('.atlas__zoom-out'),
  onZoomIn() {
    const {
      atlas,
      msaAtlas,
    } = components;
    const scale = state.get('scale');
    if (scale === 'national') {
      atlas.zoomIn();
    } else if (scale === 'msa') {
      msaAtlas.zoomIn();
    }
  },
  onZoomOut() {
    const {
      atlas,
      msaAtlas,
    } = components;
    const scale = state.get('scale');
    if (scale === 'national') {
      atlas.zoomOut();
    } else if (scale === 'msa') {
      msaAtlas.zoomOut();
    }
  },
  scaleExtent: data.get('scaleExtent'),
  currentZoom: state.get('currentZoom'),
  currentScale: state.get('scale'),
});

export default getZoomControls;
