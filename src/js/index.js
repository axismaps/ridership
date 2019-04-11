import dataMethods from './data/dataMethods';
import getState from './getComponents/getState';
import getAtlas from './getComponents/getAtlas';
import getMSAAtlas from './getComponents/getMSAAtlas';
import getIndicatorDropdown from './getComponents/getIndicatorDropdown';
import getCompareDropdown from './getComponents/getCompareDropdown';
import getSearchDropdown from './getComponents/getSearchDropdown';
import getDataviewDropdown from './getComponents/getDataviewDropdown';
import getSliderDropdown from './getComponents/getSliderDropdown';
import getSidebar from './getComponents/getSidebar';
import getHistogram from './getComponents/getHistogram';
import getMSADropdown from './getComponents/getMSADropdown';
import getHeaderButtons from './getComponents/getHeaderButtons';
import getLayout from './getComponents/getLayout';
import getCensusDropdown from './getComponents/getCensusDropdown';
import getDistanceDropdown from './getComponents/getDistanceDropdown';
import getLegend from './getComponents/getLegend';
import getZoomControls from './getComponents/getZoomControls';
import getMobileFooter from './getComponents/getMobileFooter';
import initStateUpdateListeners from './stateUpdate/stateUpdate';

require('../scss/index.scss');

const app = {
  components: {},
  data: null,
  init() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXhpc21hcHMiLCJhIjoieUlmVFRmRSJ9.CpIxovz1TUWe_ecNLFuHNg';
    const { getData } = dataMethods;
    getData((data) => {
      this.data = data;
      this.initComponents();
      this.initStateUpdateListeners();
      this.initScreenResizeListener();
      this.components.state.update({ loading: false });
      this.initStoryLightbox();
    });
  },
  initComponents() {
    const { components, data } = this;
    const state = getState({ components, data });
    components.state = state;
    components.layout = getLayout({ state, data });
    components.sidebar = getSidebar({ state, data });
    if (state.get('embed') === 'sidebar') return;
    components.atlas = getAtlas({ data, state });


    if (state.get('scale') === 'msa') {
      state.getCurrentTractGeo((tractGeo) => {
        components.histogram = getHistogram({ state, data, tractGeo });
        components.msaAtlas = getMSAAtlas({ state, data, tractGeo });
      });
    } else {
      components.histogram = getHistogram({ state, data });
      components.msaAtlas = getMSAAtlas({ state, data });
    }

    components.indicatorDropdown = getIndicatorDropdown({ state, data });
    components.sliderDropdown = getSliderDropdown({ state, data });
    components.compareDropdown = getCompareDropdown({ state, data });
    components.searchDropdown = getSearchDropdown({ state, data });
    components.msaDropdown = getMSADropdown({ state, data });
    components.dataViewDropdown = getDataviewDropdown({ state });
    components.censusDropdown = getCensusDropdown({ state, data });
    components.distanceDropdown = getDistanceDropdown({ state, data });
    components.headerButtons = getHeaderButtons({ state, data, components });
    components.zoomControls = getZoomControls({ state, data, components });
    components.legend = getLegend({ state, data });
    components.mobileFooter = getMobileFooter({ state });
  },
  initStateUpdateListeners() {
    const { components, data } = this;
    initStateUpdateListeners({ components, data });
  },
  initScreenResizeListener() {
    const { state } = this.components;
    d3.select(window).on('resize', () => {
      state.update({
        screenSize: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
    });
  },
  initStoryLightbox() {
    const storyLightbox = d3.select('.story-lightbox');
    storyLightbox
      .classed('show', true)
      .select('.lightbox__content')
      .html('<h3>Cool story</h3><p>I am a lightbox!</p>');
  },
};

app.init();
