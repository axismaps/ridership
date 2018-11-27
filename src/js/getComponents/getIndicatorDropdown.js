import IndicatorDropdown from '../dropdown/indicatorDropdown';

const getIndicatorDropdown = ({ data, state }) => new IndicatorDropdown({
  indicator: state.get('indicator'),
  updateIndicator: (newIndicator) => {
    const currentIndicator = state.get('indicator');
    if (newIndicator !== currentIndicator) {
      state.update({ indicator: newIndicator });
    }
  },
  indicators: data.get('indicators'),
});

export default getIndicatorDropdown;
