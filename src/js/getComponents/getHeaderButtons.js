import exportMethods from '../export/exportMethods';
import HeaderButtons from '../header/headerButtons';

const getHeaderButtons = ({ state, data, components }) => new HeaderButtons({
  exportComponents: (callback) => {
    const {
      atlas,
      sidebar,
      histogram,
      msaAtlas,
      legend,
    } = components;

    const atlasPromise = state.get('scale') === 'national' ? atlas.export() : msaAtlas.export();

    Promise.all([
      atlasPromise,
      sidebar.export(),
      histogram.export(),
      legend.export(),
    ]).then(([atlasImage, sidebarImage, histogramImage, legendImage]) => {
      callback({
        atlasImage,
        sidebarImage,
        histogramImage,
        legendImage,
      });
    });
  },
  exportMethods,
  aboutButton: d3.select('.header__about-button'),
  downloadButton: d3.select('.header__download-button'),
  exportButton: d3.select('.header__export-button'),
});

export default getHeaderButtons;
