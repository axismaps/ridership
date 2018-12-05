const getStateUpdateMSA = ({ components, data }) => function updateMSA() {
  const {
    msaAtlas,
  } = components;
  const msa = this.get('msa');
  msaAtlas
    .config({
      msa,
    })
    .updateMSA();
  console.log('msa', msa);
};

export default getStateUpdateMSA;
