import Sidebar from '../sidebar/sidebar';

const getSidebar = ({ data, state }) => new Sidebar({
  indicatorSummaries: data.get('indicatorSummaries'),
  currentIndicator: state.get('indicator'),
  yearRange: state.get('yearRange'),
  scale: state.get('scale'),
  contentContainer: d3.select('.sidebar__content'),
  topRowContainer: d3.select('.sidebar__top-row'),
});

export default getSidebar;
