import dataMethods from './data/dataMethods';
import getState from './getComponents/getState';

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
    components.state = getState({ components, data });
  },
};

app.init();
