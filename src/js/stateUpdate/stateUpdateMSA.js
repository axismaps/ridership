const getStateUpdateMSA = ({ components }) => function updateMSA() {
  const msa = this.get('msa');
  const { msaAtlas } = components;

  this.getCurrentTractGeo((tractGeo) => {
    msaAtlas
      .config({
        msa,
        tractGeo,
      })
      .updateMSA();
  });
};

export default getStateUpdateMSA;
