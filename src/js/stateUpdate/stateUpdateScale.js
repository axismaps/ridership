const getStateUpdateScale = ({ components }) => function updateScale() {
  const {
    layout,
    msaAtlas,
  } = components;

  const scale = this.get('scale');

  layout
    .config({
      scale,
    })
    .updateScale();

  msaAtlas
    .config({
      scale,
    });
};

export default getStateUpdateScale;
