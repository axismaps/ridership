import Layout from '../layout/layout';

const getLayout = ({ state }) => new Layout({
  scale: state.get('scale'),
  outerContainer: d3.select('.outer-container'),
});

export default getLayout;
