const getStateUpdateScale = ({ components }) => function updateScale() {
  const {
    atlas,
  } = components;

  const scale = this.get('scale');
  if (scale === 'msa') {
    const msa = this.get('msa');
    console.log('MSA?!?', msa);
  }
};

export default getStateUpdateScale;
