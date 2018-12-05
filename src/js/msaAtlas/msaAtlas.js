import msaAtlasFunctions from './msaAtlasFunctions';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    console.log('INIT MSA ATLAS');
  },
};

class MSAAtlas {
  constructor(config) {
    privateProps.set(this, {});

    this.config(config);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }
}

export default MSAAtlas;
