import dataMethods from './data/dataMethods';

require('../scss/index.scss');

const app = {
  components: {},
  data: null,
  init() {
    const { getData } = dataMethods;
    getData(() => {
      console.log('init data');
    });
  },
  initComponents() {

  },
};

app.init();
