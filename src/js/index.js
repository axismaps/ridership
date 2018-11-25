import dataMethods from './data/dataMethods';
import getState from './getComponents/getState';
import getAtlas from './getComponents/getAtlas';
import getIndicatorDropdown from './getComponents/getIndicatorDropdown';
import getSliderDropdown from './getComponents/getSliderDropdown';
import initStateUpdateListeners from './stateUpdate/stateUpdate';

require('../scss/index.scss');

const app = {
  components: {},
  data: null,
  init() {
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
    components.atlas = getAtlas({ data, state });
    components.indicatorDropdown = getIndicatorDropdown({ state, data });
    components.sliderDropdown = getSliderDropdown({ state, data });
  },
  initStateUpdateListeners() {
    const { components, data } = this;
    initStateUpdateListeners({ components, data });
  },
};

app.init();
