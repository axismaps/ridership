const getStateUpdateLoading = ({ components }) => function updateLoading() {
  const {
    layout,
  } = components;
  const loading = this.get('loading');

  layout
    .config({
      loading,
    })
    .updateLoading();
};

export default getStateUpdateLoading;
