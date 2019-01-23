const getStateUpdateSidebarView = ({ components }) => function updateSidebarView() {
  const {
    sidebar,
    mobileFooter,
  } = components;
  const sidebarView = this.get('sidebarView');
  sidebar
    .config({
      sidebarView,
    });

  mobileFooter
    .config({
      sidebarView,
    });
};

export default getStateUpdateSidebarView;
