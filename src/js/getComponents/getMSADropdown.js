import MSADropdown from '../dropdown/msaDropdown';

const getMSADropdown = ({ data, state }) => new MSADropdown({
  dropdownOpen: false,
  toggleButton: d3.select('.header__msa-dropdown-text'),
  currentMSA: state.get('msa'),
  msaList: data.get('msa'),
  contentOuterContainer: d3.select('.msa-dropdown__content-container'),
  contentContainer: d3.select('.msa-dropdown__content'),
  updateMSA: (newMSA) => {
    const currentMSA = state.get('msa');

    if (currentMSA === null || currentMSA.msaId !== newMSA.msaId) {
      if (state.get('scale') === 'national') {
        state.update({
          msa: newMSA,
          scale: 'msa',
        });
      } else {
        state.update({
          msa: newMSA,
        });
      }
    }
  },
});

export default getMSADropdown;