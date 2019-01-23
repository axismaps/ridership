
const privateProps = new WeakMap();

const privateMethods = {
  setButtonListeners() {
    const {
      mapButton,
      sparkLineButton,
      pcpButton,
      toggleFooter,
    } = privateProps.get(this);

    mapButton
      .on('click', () => {
        toggleFooter({ sidebarView: null });
      });

    sparkLineButton
      .on('click', () => {
        toggleFooter({ sidebarView: 'sparkLines' });
      });

    pcpButton
      .on('click', () => {
        toggleFooter({ sidebarView: 'pcp' });
      });
  },
  updateButtonHighlight() {
    const {
      mapButton,
      sparkLineButton,
      pcpButton,
      sidebarView,
    } = privateProps.get(this);
    const highlightClass = 'footer__modal-button--highlighted';
    mapButton
      .classed(highlightClass, sidebarView === null);

    sparkLineButton
      .classed(highlightClass, sidebarView === 'sparkLines');

    pcpButton
      .classed(highlightClass, sidebarView === 'pcp');
  },
};

class MobileFooter {
  constructor(config) {
    privateProps.set(this, {});
    this.config(config);

    const {
      setButtonListeners,
      updateButtonHighlight,
    } = privateMethods;

    setButtonListeners.call(this);
    updateButtonHighlight.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  updateSidebarView() {
    const {
      updateButtonHighlight,
    } = privateMethods;

    updateButtonHighlight.call(this);
  }
}

export default MobileFooter;
