import getPrivateBase from './dropdownBase';
import pureMethods from './searchDropdownMethods';
import getPublicDropdownBase from './dropdownPublicBase';

const privateProps = new WeakMap();

const privateMethods = {
  init() {
    const props = privateProps.get(this);
    const {
      contentOuterContainer,
      contentContainer,
      updateSearchResult,
      allNationalMapData,
      toggleButton,
      nationalDataView,
    } = props;

    const {
      setContentVisibility,
      setContentPosition,
    } = privateMethods;

    const {
      drawInput,
      setSearchEvent,
    } = pureMethods;

    const searchInput = drawInput({
      toggleButton,
      contentContainer,
      contentOuterContainer,
    });

    setSearchEvent({
      searchInput,
      allNationalMapData,
      contentContainer,
      contentOuterContainer,
      nationalDataView,
      updateSearchResult,
    });

    props.searchInput = searchInput;

    setContentVisibility.call(this);

    toggleButton.select('.fa-times-circle').on('click', () => {
      d3.event.stopPropagation();
      updateSearchResult(null);
      d3.select('.outer-container').classed('search-active', false);
    });

    setContentPosition.call(this);
  },
};

class SearchDropdown {
  constructor(config) {
    const {
      init,
    } = privateMethods;
    privateProps.set(this, {

    });
    this.config(config);

    init.call(this);
  }

  config(config) {
    Object.assign(privateProps.get(this), config);
    return this;
  }

  update() {
    const {
      searchInput,
      allNationalMapData,
      contentContainer,
      contentOuterContainer,
      nationalDataView,
      toggleButton,
      searchResult,
      updateSearchResult,
    } = privateProps.get(this);

    const {
      setSearchEvent,
      setButtonText,
    } = pureMethods;

    setSearchEvent({
      searchInput,
      allNationalMapData,
      contentContainer,
      contentOuterContainer,
      nationalDataView,
      updateSearchResult,
    });

    setButtonText({
      toggleButton,
      searchResult,
    });

    d3.select('.outer-container').classed('search-result', searchResult !== null);

    return this;
  }
}

Object.assign(
  privateMethods,
  getPrivateBase({ privateProps, privateMethods }),
);

Object.assign(
  SearchDropdown.prototype,
  getPublicDropdownBase({ privateProps, privateMethods }),
);

export default SearchDropdown;
