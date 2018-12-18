import DataViewDropdown from '../dropdown/dataviewDropdown';

const getDataviewDropdown = ({ state }) => new DataViewDropdown({
  contentContainer: d3.select('.header__data-view-container'),
  nationalDataView: state.get('nationalDataView'),
  updateNationalDataView: (newView) => {
    const nationalDataView = state.get('nationalDataView');
    if (newView !== nationalDataView) {
      state.update({ compareMode: false });
      state.update({ comparedAgencies: [] });
      state.update({ nationalDataView: newView });
    }
  },
});

export default getDataviewDropdown;
