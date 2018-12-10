const getStateUpdateComparedAgencies = ({ components }) => function updateComparedAgencies() {
  const {
    atlas,
    histogram,
    sidebar,
    compareDropdown,
  } = components;

  const comparedAgencies = this.get('comparedAgencies');
  const indicatorSummaries = this.getCurrentIndicatorSummaries();
  const agenciesData = this.getCurrentAgenciesData();

  compareDropdown
    .config({
      comparedAgencies,
    })
    .update();

  atlas
    .config({
      comparedAgencies,
    });

  histogram
    .config({
      comparedAgencies,
    });

  sidebar
    .config({
      comparedAgencies,
      indicatorSummaries,
      agenciesData,
    })
    .updateData();
};

export default getStateUpdateComparedAgencies;
