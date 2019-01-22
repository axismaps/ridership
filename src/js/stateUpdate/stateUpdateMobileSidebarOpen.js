const getStateUpdateMobileSidebarOpen = ({ components }) => function updateMobileSidebarOpen() {
  const {
    sidebar,
  } = components;

  const mobileSidebarOpen = this.get('mobileSidebarOpen');

  sidebar
    .config({
      mobileSidebarOpen,
    })
    .updateToggle();
};

export default getStateUpdateMobileSidebarOpen;
