const getPublicDropdownBase = ({ privateMethods }) => ({
  resetMenuPosition() {
    const {
      setContentPosition,
    } = privateMethods;
    setContentPosition.call(this);
  },
});

export default getPublicDropdownBase;
