import sparklineFunctions from './sidebarSparklineFunctions';
import agencyLegendFunctions from './sidebarAgenciesLegendFunctions';
import getExport from './sidebarExport';

const getPublicFunctions = ({
  privateProps,
  privateMethods,
}) => ({
  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  },

  updateCurrentIndicator() {
    const {
      currentIndicator,
      sparkLines,
      sparkTitles,
      pcp,
      sidebarView,
      currentIndicatorDisabled,
    } = privateProps.get(this);

    if (sidebarView === 'sparkLines') {
      sparkTitles
        .classed('sidebar__sparkline-title--selected', d => currentIndicator.value === d.value
        && !currentIndicatorDisabled);

      sparkLines
        .forEach((sparkLine) => {
          sparkLine
            .config({
              selected: currentIndicator.value === sparkLine.getIndicator().value
              && !currentIndicatorDisabled,
            })
            .updateSelected();
        });
    } else {
      pcp.config({
        currentIndicator,
      })
        .updateSelected();
    }

    return this;
  },

  updateExpandedIndicator() {
    const {
      updateExpandedSparkline,
    } = sparklineFunctions;

    const {
      sparkRows,
      sparkLines,
      sidebarView,
      expandedIndicator,
    } = privateProps.get(this);
    if (sidebarView === 'sparkLines') {
      updateExpandedSparkline({
        sparkRows,
        sparkLines,
        expandedIndicator,
      });
    }

    return this;
  },

  updateYears() {
    const {
      contentContainer,
      years,
    } = privateProps.get(this);

    contentContainer.select('span.sidebar__pcp-years').html(`${years.join(' – ')}`);

    return this;
  },

  updateData() {
    const props = privateProps.get(this);
    const {
      pcp,
      agenciesData,
      sidebarView,
      // indicatorSummaries,
      currentScale,
      legendContainer,
    } = props;

    const {
      drawContent,
      drawNationalCompareList,
      drawMSASparkLineLegend,
    } = privateMethods;
    const {
      clearLegend,
    } = agencyLegendFunctions;
    clearLegend({
      legendContainer,
      resetOpenDropdowns: () => {
        props.openedSubDropdowns = [];
      },
    });
    const msaScale = currentScale === 'msa';
    if (msaScale) {
      drawMSASparkLineLegend.call(this);
    }
    if (sidebarView === 'parallel') {
      pcp
        .config({
          agenciesData,
          msaScale: currentScale === 'msa',
        })
        .updateData();
      drawNationalCompareList.call(this);
    } else {
      drawContent.call(this);
    }

    return this;
  },

  updateHighlight() {
    const {
      pcp,
      highlightedAgencies,
      sidebarView,
    } = privateProps.get(this);

    if (sidebarView === 'parallel') {
      pcp
        .config({
          highlightedAgencies,
        })
        .updateHighlight();
    }

    return this;
  },

  updateSearchResult() {
    const {
      pcp,
      searchResult,
      sidebarView,
    } = privateProps.get(this);

    if (sidebarView === 'parallel') {
      pcp
        .config({
          searchResult,
        })
        .updateSearchResult();
    }

    return this;
  },

  updateSize() {
    const {
      drawContent,
      setDimensions,
    } = privateMethods;

    setDimensions.call(this);
    drawContent.call(this);

    const {
      width,
      sparkLineAxisContainer,
    } = privateProps.get(this);

    sparkLineAxisContainer.style('width', `${width * 0.4}px`);

    return this;
  },

  updateToggle() {
    const {
      mobileSidebarOpen,
    } = privateProps.get(this);

    const {
      drawContent,
      setDimensions,
    } = privateMethods;

    if (mobileSidebarOpen) {
      setDimensions.call(this);
      drawContent.call(this);
    }
  },

  updateView() {
    const {
      sidebarView,
    } = privateProps.get(this);

    const {
      drawContent,
    } = privateMethods;

    if (sidebarView !== null) {
      drawContent.call(this);
    }
  },
  export: getExport({ privateProps, privateMethods }),
});

export default getPublicFunctions;
