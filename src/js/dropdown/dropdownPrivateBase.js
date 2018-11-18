const getDropdownPrivateBase = ({
  privateProps,
  privateMethods,
}) => ({
  setToggleButtonClick() {
    const props = privateProps.get(this);
    const { toggleButton } = props;
    const { toggleMenu } = privateMethods;

    toggleButton
      .on('click', toggleMenu.bind(this));
  },
  toggleMenu() {
    const props = privateProps.get(this);
    const {
      contentOuterContainer,
    } = props;


    props.dropdownOpen = !props.dropdownOpen;
    console.log('menu open', props.dropdownOpen);
    contentOuterContainer
      .classed('dropdown-content--open', props.dropdownOpen);
  },
});

export default getDropdownPrivateBase;
