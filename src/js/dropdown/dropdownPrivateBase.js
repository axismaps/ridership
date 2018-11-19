const getDropdownPrivateBase = ({
  privateProps,
  privateMethods,
}) => ({
  setToggleButtonClick() {
    const props = privateProps.get(this);
    const { toggleButton } = props;
    const { setContentVisibility } = privateMethods;

    toggleButton
      .on('click', () => {
        props.dropdownOpen = !props.dropdownOpen;
        setContentVisibility.call(this);
      });
  },
  setContentVisibility() {
    const props = privateProps.get(this);
    const {
      contentOuterContainer,
      dropdownOpen,
    } = props;

    contentOuterContainer
      .classed('dropdown-content--open', dropdownOpen);
  },
});

export default getDropdownPrivateBase;
