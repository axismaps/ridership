import setAllDropdownPositions from '../dropdown/setDropdownPositions';

const getStateUpdateIndicator = ({ components }) => function updateIndicator() {
  const {
    indicatorDropdown,
    atlas,
    sidebar,
    histogram,
  } = components;
  const indicator = this.get('indicator');
  const nationalMapData = this.getCurrentNationalMapData();
  const nationalData = this.getCurrentNationalData();

  indicatorDropdown
    .config({
      indicator,
    })
    .update();

  atlas
    .config({
      nationalMapData,
      indicator,
    })
    .updateNationalMapData()
    .updateInteractions();
  if (histogram !== null) {
    histogram
      .config({
        currentIndicator: indicator,
        nationalMapData,
        nationalData,
      })
      .updateData();
  }


  sidebar
    .config({
      currentIndicator: indicator,
    })
    .updateCurrentIndicator();

  setAllDropdownPositions({ components });
};

export default getStateUpdateIndicator;
