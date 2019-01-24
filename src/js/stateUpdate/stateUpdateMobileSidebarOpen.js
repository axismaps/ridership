const getStateUpdateMobileSidebarOpen = ({ components }) => function updateMobileSidebarOpen() {
  const {
    // sidebar,
    layout,
    mobileFooter,
  } = components;

  const mobileSidebarOpen = this.get('mobileSidebarOpen');
  const mobile = this.get('mobile');
  if (!mobile) return;


  layout
    .config({
      mobileSidebarOpen,
    })
    .updateSidebarToggle();

  mobileFooter
    .config({
      mobileSidebarOpen,
    })
    .updateSidebarView();
  // sidebar
  //   .config({
  //     mobileSidebarOpen,
  //   })
  //   .updateToggle();
};

export default getStateUpdateMobileSidebarOpen;
