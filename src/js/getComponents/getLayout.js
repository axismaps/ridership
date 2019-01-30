import Layout from '../layout/layout';

const getLayout = ({ state, data }) => new Layout({
  scale: state.get('scale'),
  outerContainer: d3.select('.outer-container'),
  histogramButton: d3.select('.atlas__histogram-button-outer'),
  histogramBackButton: d3.select('.header__histogram-back'),
  mobileHistogramOpen: state.get('mobileHistogramOpen'),
  backButton: d3.select('.atlas__back-button'),
  distanceFilter: state.get('distanceFilter'),
  clearDistanceButton: d3.select('.atlas__distance-dropdown-clear'),
  embedded: state.get('embedded'),
  params: data.get('params'),
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
  openHistogram: () => {
    state.update({ mobileHistogramOpen: true });
  },
  closeHistogram: () => {
    state.update({ mobileHistogramOpen: false });
  },
});

export default getLayout;
