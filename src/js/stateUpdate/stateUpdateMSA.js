const getStateUpdateMSA = ({ components }) => function updateMSA() {
  const msa = this.get('msa');
  const {
    msaAtlas,
    histogram,
  } = components;

  this.getCurrentTractGeo((tractGeo) => {
    msaAtlas
      .config({
        msa,
        tractGeo,
      })
      .updateMSA();

    histogram
      .config({
        msa,
        tractGeo,
      })
      .updateData();
  });
};

export default getStateUpdateMSA;
