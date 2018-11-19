const getDropdownPrivateBase = ({
  privateProps,
  privateMethods,
}) => ({


  setMenuToggleEvents() {
    const props = privateProps.get(this);
    const {
      toggleButton,
      contentOuterContainer,
    } = props;
    const {
      setContentVisibility,
    } = privateMethods;

    const clearTimer = () => {
      const { timer } = props;
      if (timer !== null) {
        clearTimeout(timer);
      }
    };
    const setTimer = () => {
      const timer = setTimeout(() => {
        props.dropdownOpen = false;
        setContentVisibility.call(this);
      }, 250);
      props.timer = timer;
    };

    const setContainerMouseEvents = (container) => {
      container
        .on('mouseenter', () => {
          props.dropdownOpen = true;
          setContentVisibility.call(this);
          clearTimer();
        })
        .on('mouseleave', setTimer.bind(this));
    };

    setContainerMouseEvents(toggleButton);
    setContainerMouseEvents(contentOuterContainer);
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
