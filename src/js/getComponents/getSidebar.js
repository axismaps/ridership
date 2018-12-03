import Sidebar from '../sidebar/sidebar';

const getSidebar = ({ data, state }) => new Sidebar({
  indicatorSummaries: data.get('indicatorSummaries'),
  allAgenciesData: state.getCurrentAllAgenciesData(),
  currentIndicator: state.get('indicator'),
  yearRange: data.get('yearRange'),
  scale: state.get('scale'),
  contentContainer: d3.select('.sidebar__content'),
  topRowContainer: d3.select('.sidebar__top-row'),
  updateCurrentIndicator: (newIndicator) => {
    state.update({ indicator: newIndicator });
  },
});

export default getSidebar;
