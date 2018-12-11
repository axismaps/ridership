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
  removeMenuToggleEvents() {
    const props = privateProps.get(this);
    const {
      toggleButton,
      contentOuterContainer,
    } = props;
    const {
      setContentVisibility,
    } = privateMethods;
    const removeContainerMouseEvents = (container) => {
      container
        .on('mouseenter', null)
        .on('mouseleave', null);
    };

    removeContainerMouseEvents(toggleButton);
    removeContainerMouseEvents(contentOuterContainer);
    props.dropdownOpen = false;
    setContentVisibility.call(this);
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
  setContentPosition() {
    const {
      toggleButton,
      contentOuterContainer,
      alignMenuToButton,
    } = privateProps.get(this);
    const {
      left,
      top,
      height,
      width,
    } = toggleButton.node().getBoundingClientRect();

    const menuMargin = 10;

    contentOuterContainer
      .styles({
        position: 'absolute',
        top: `${top + height + menuMargin}px`,
      });

    if (alignMenuToButton === 'right') {
      contentOuterContainer
        .style('right', `${window.innerWidth - left - width}px`);
    } else {
      contentOuterContainer
        .styles({
          left: `${left}px`,
        });
    }
  },
});

export default getDropdownPrivateBase;
