import Layout from '../layout/layout';

const getLayout = ({ state }) => new Layout({
  scale: state.get('scale'),
  outerContainer: d3.select('.outer-container'),
  backButton: d3.select('.atlas__back-button'),
  returnToNationalScale: () => {
    state.set('msa', null);
    state.update({
      scale: 'national',
    });
  },
});

export default getLayout;
