const getTopButtonFunctions = ({ privateProps, privateMethods }) => ({
  setTopButtonEvents() {
    const props = privateProps.get(this);
    const {
      parallelButtonContainer,
      sparkLineButtonContainer,
      compareContainer,
      updateComparedAgencies,
    } = props;
    const {
      drawContent,
    } = privateMethods;
    const setNewView = (newView) => {
      const currentView = props.sidebarView;
      if (newView === currentView) return;
      props.sidebarView = newView;
      drawContent.call(this);
    };
    parallelButtonContainer
      .on('click', () => {
        setNewView('parallel');
      });

    sparkLineButtonContainer
      .on('click', () => {
        setNewView('sparkLines');
      });

    compareContainer.select('.sidebar__compare-clear-button')
      .on('click', () => updateComparedAgencies([]));
  },
  setTopButtonStatus() {
    const {
      sidebarView,
      parallelButtonContainer,
      sparkLineButtonContainer,
    } = privateProps.get(this);
    parallelButtonContainer
      .classed('sidebar__top-button--active', sidebarView === 'parallel');
    sparkLineButtonContainer
      .classed('sidebar__top-button--active', sidebarView === 'sparkLines');
  },
});

export default getTopButtonFunctions;
