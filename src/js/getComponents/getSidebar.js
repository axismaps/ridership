import Sidebar from '../sidebar/sidebar';
import exportMethods from '../export/exportMethods';

const getSidebar = ({ data, state }) => new Sidebar({
  mobile: state.get('mobile'),
  mobileSidebarOpen: state.get('mobileSidebarOpen'),
  exportMethods,
  indicatorSummaries: state.getCurrentIndicatorSummaries(),
  agenciesData: state.getCurrentAgenciesData(),
  currentAgencies: state.getAllAgenciesForCurrentMSA(),
  currentIndicator: state.get('indicator'),
  currentIndicatorDisabled: false, // disable ability to select sparklines, for msa-scale
  nationalDataView: state.get('nationalDataView'),
  expandedIndicator: state.get('expandedIndicator'),
  sidebarView: 'sparkLines',
  years: state.get('years'),
  yearRange: data.get('yearRange'),
  comparedAgencies: state.get('comparedAgencies'),
  currentScale: state.get('scale'),
  taFilter: state.get('taFilter'),
  contentContainer: d3.select('.sidebar__content'),
  legendContainer: d3.select('.sidebar__agency-legend'),
  compareContainer: d3.select('.sidebar__compare-list'),
  topRowContainer: d3.select('.sidebar__top-row'),
  parallelButtonContainer: d3.select('.sidebar__parallel-button'),
  sparkLineAxisYear1: d3.select('.sidebar__sparkline-axis-year1'),
  sparkLineAxisYear2: d3.select('.sidebar__sparkline-axis-year2'),
  sparkLineAxisContainer: d3.select('.sidebar__sparkline-axis'),
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
  updateComparedAgencies: (newCompare) => {
    const comparedAgencies = state.get('comparedAgencies');
    let matches = newCompare.length === comparedAgencies.length;
    if (matches) {
      newCompare.forEach((ta, i) => {
        if (comparedAgencies[i].taId !== ta.taId) matches = false;
      });
    }
    state.update({ comparedAgencies: matches ? [] : newCompare });
  },
  updateCompareMode: (compareMode) => {
    state.update({ compareMode });
  },
  updateTAFilter(newAgency) {
    const currentTAFilter = state.get('taFilter');

    /**
     * Make copy of current taFilter, add/remove new filter
     * @private
     */
    if (currentTAFilter.has(newAgency)) {
      const filterCopy = new Set(currentTAFilter);
      filterCopy.delete(newAgency);
      state.update({ taFilter: filterCopy });
    } else {
      const filterCopy = new Set(currentTAFilter);
      filterCopy.add(newAgency);
      state.update({ taFilter: filterCopy });
    }
  },
  updateMSA: (pcpLine) => {
    const currentMSA = state.get('msa');
    const newMSA = data.get('msa')
      .find(d => pcpLine.msaId === d.msaId);

    if (currentMSA === null || currentMSA.msaId !== newMSA.msaId) {
      if (state.get('scale') === 'national') {
        const years = state.get('years');
        if (years[0] < 2010 || years[1] > 2016) {
          state.update({ years: [d3.max([2010, years[0]]), d3.min([2016, years[1]])] });
        }
        state.update({
          scale: 'msa',
          msa: newMSA,

        });
      }
    }
  },
});

export default getSidebar;
