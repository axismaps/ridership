const getStateUpdateMobileSidebarOpen = ({ components }) => function updateMobileSidebarOpen() {
  const {
    // sidebar,
    layout,
  } = components;

  const mobileSidebarOpen = this.get('mobileSidebarOpen');
  const mobile = this.get('mobile');
  if (!mobile) return;
  console.log('OPEN', mobileSidebarOpen);

  layout
    .config({
      mobileSidebarOpen,
    })
    .updateSidebarToggle();

  // sidebar
  //   .config({
  //     mobileSidebarOpen,
  //   })
  //   .updateToggle();
};

export default getStateUpdateMobileSidebarOpen;
