import Sidebar from '../sidebar/sidebar';

const getSidebar = ({ data, state }) => new Sidebar({
  indicatorSummaries: data.get('indicatorSummaries'),
  currentIndicator: state.get('indicator'),
  currentSidebarView: 'sparklines',
  yearRange: data.get('yearRange'),
  currentScale: state.get('scale'),
  contentContainer: d3.select('.sidebar__content'),
  topRowContainer: d3.select('.sidebar__top-row'),
  parallelButtonContainer: d3.select('.sidebar__parallel-button'),
  sparkLineButtonContainer: d3.select('.sidebar__sparkline-button'),
  updateCurrentIndicator: (newIndicator) => {
    state.update({ indicator: newIndicator });
  },
});

export default getSidebar;
