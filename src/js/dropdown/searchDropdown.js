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
      updateSearchResult,
      allNationalMapData,
      nationalDataView,
    });

    setSearchEvent({
      searchInput,
      allNationalMapData,
      contentContainer,
      contentOuterContainer,
      nationalDataView,
    });

    props.searchInput = searchInput;

    setContentVisibility.call(this);

    toggleButton.select('.fa-times-circle').on('click', () => {
      updateSearchResult(null);
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
    } = privateProps.get(this);

    const {
      setSearchEvent,
    } = pureMethods;

    setSearchEvent({
      searchInput,
      allNationalMapData,
      contentContainer,
      contentOuterContainer,
      nationalDataView,
    });
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
