import MobileFooter from '../mobileFooter/mobileFooter';

const getMobileFooter = ({ state }) => new MobileFooter({
  mapButton: d3.select('.footer__map-modal-button'),
  sparkLineButton: d3.select('.footer__sparkline-modal-button'),
  pcpButton: d3.select('.footer__pcp-modal-button'),
  sidebarView: state.get('sidebarView'),
  toggleFooter({ sidebarView }) {
    const currentSidebarView = state.get('sidebarView');
    const currentSidebarOpen = state.get('mobileSidebarOpen');

    if (currentSidebarView === sidebarView && currentSidebarOpen) return;
    if (sidebarView === null) {
      state.update({
        mobileSidebarOpen: false,
      });
    } else if (currentSidebarOpen) {
      state.update({ sidebarView });
    } else {
      state.update({
        sidebarView,
        mobileSidebarOpen: true,
      });
    }

    // if (!mobileSidebarOpen) {
    //   state.set({ sidebarView });
    //   state.update({ mobileSidebarOpen: true });
    //   return;
    // }
    // if (sidebarView === currentSidebarView) {
    //   console.log('same');
    //   state.update({ mobileSidebarOpen: false });
    // } else {
    //   state.update({ sidebarView });
    // }
  },
});

export default getMobileFooter;
