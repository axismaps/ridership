import Layout from '../layout/layout';

const getLayout = ({ state }) => new Layout({
  scale: state.get('scale'),
  outerContainer: d3.select('.outer-container'),
  backButton: d3.select('.atlas__back-button'),
  distanceFilter: state.get('distanceFilter'),
  clearDistanceButton: d3.select('.atlas__distance-dropdown-clear'),
  returnToNationalScale: () => {
    state.set('msa', null);
    state.update({
      scale: 'national',
    });
  },
  clearDistanceFilter: () => {
    state.update({
      distanceFilter: null,
    });
  },
});

export default getLayout;
