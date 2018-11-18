import dataMethods from './data/dataMethods';
import getState from './getComponents/getState';
import getAtlas from './getComponents/getAtlas';
import getIndicatorDropdown from './getComponents/getIndicatorDropdown';
import getSliderDropdown from './getComponents/getSliderDropdown';

require('../scss/index.scss');

const app = {
  components: {},
  data: null,
  init() {
    const { getData } = dataMethods;
    getData((data) => {
      this.data = data;
      this.initComponents();
    });
  },
  initComponents() {
    const { components, data } = this;
    const state = getState({ components, data });
    components.state = state;
    components.atlas = getAtlas({ data, state });
    components.indicatorDropdown = getIndicatorDropdown({ state, data });
    components.getSliderDropdown = getSliderDropdown({ state, data });
  },
};

app.init();
