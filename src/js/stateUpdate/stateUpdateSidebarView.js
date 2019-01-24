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
    })
    .updateSidebarView();
};

export default getStateUpdateSidebarView;
