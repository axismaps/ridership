import MobileFooter from '../mobileFooter/mobileFooter';

const getMobileFooter = ({ state }) => new MobileFooter({
  mapButton: d3.select('.footer__map-modal-button'),
  sparkLineButton: d3.select('.footer__sparkline-modal-button'),
  pcpButton: d3.select('.footer__pcp-modal-button'),
  
});

export default getMobileFooter;
