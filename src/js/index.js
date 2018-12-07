import dataMethods from './data/dataMethods';
import getState from './getComponents/getState';
import getAtlas from './getComponents/getAtlas';
import getMSAAtlas from './getComponents/getMSAAtlas';
import getIndicatorDropdown from './getComponents/getIndicatorDropdown';
import getCompareDropdown from './getComponents/getCompareDropdown';
import getSliderDropdown from './getComponents/getSliderDropdown';
import getSidebar from './getComponents/getSidebar';
import getHistogram from './getComponents/getHistogram';
import getMSADropdown from './getComponents/getMSADropdown';
import getLayout from './getComponents/getLayout';
import getCensusDropdown from './getComponents/getCensusDropdown';
import getDistanceDropdown from './getComponents/getDistanceDropdown';
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
    });
  },
  initComponents() {
    const { components, data } = this;
    const state = getState({ components, data });
    components.state = state;
    components.layout = getLayout({ state, data });
    components.atlas = getAtlas({ data, state });
    components.indicatorDropdown = getIndicatorDropdown({ state, data });
    components.sliderDropdown = getSliderDropdown({ state, data });
    components.compareDropdown = getCompareDropdown({ state, data });
    components.msaDropdown = getMSADropdown({ state, data });
    components.sidebar = getSidebar({ state, data });
    components.histogram = getHistogram({ state, data });
    components.msaAtlas = getMSAAtlas({ state, data });
    components.censusDropdown = getCensusDropdown({ state, data });
    components.distanceDropdown = getDistanceDropdown({ state, data });
  },
  initStateUpdateListeners() {
    const { components, data } = this;
    initStateUpdateListeners({ components, data });
  },
};

app.init();
