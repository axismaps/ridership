import Sidebar from '../sidebar/sidebar';

const getSidebar = ({ data, state }) => new Sidebar({
  indicatorSummaries: data.get('indicatorSummaries'),
  allAgenciesData: state.getCurrentAllAgenciesData(),
  currentIndicator: state.get('indicator'),
  currentSidebarView: 'sparklines',
  yearRange: data.get('yearRange'),
  currentScale: state.get('scale'),
  contentContainer: d3.select('.sidebar__content'),
  topRowContainer: d3.select('.sidebar__top-row'),
  parallelButtonContainer: d3.select('.sidebar__parallel-button'),
  sparkLineButtonContainer: d3.select('.sidebar__sparkline-button'),
  updateIndicator: (newIndicator) => {
    const currentIndicator = state.get('indicator');
    if (newIndicator !== currentIndicator) {
      state.update({ indicator: newIndicator });
    }
  },
  updateHighlightedAgencies: (newHighlight) => {
    const highlights = newHighlight || [];
    state.update({ highlightedAgencies: highlights });
  },
  updateExpandedIndicator: (newExpanded) => {
    const expandedIndicator = state.get('expandedIndicator');
    if (expandedIndicator !== null
      && newExpanded !== null
      && newExpanded.value === expandedIndicator.value) {
      state.update({ expandedIndicator: null });
    } else {
      state.update({ expandedIndicator: newExpanded });
    }
  },
});

export default getSidebar;
