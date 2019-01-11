const setAllDropdownPositions = ({ components }) => {
  const {
    distanceDropdown,
    indicatorDropdown,
    searchDropdown,
    msaDropdown,
    censusDropdown,
    compareDropdown,
    sliderDropdown,
  } = components;

  [
    distanceDropdown,
    indicatorDropdown,
    searchDropdown,
    msaDropdown,
    censusDropdown,
    compareDropdown,
    sliderDropdown,
  ].forEach((dropdown) => {
    if (dropdown !== undefined
        && 'resetMenuPosition' in dropdown) {
      dropdown.resetMenuPosition();
    }
  });
};

export default setAllDropdownPositions;
