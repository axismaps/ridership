import DataProbe from '../dataProbe/dataProbe';
import atlasHelperFunctions from './atlasHelperFunctions';

const maxCompared = 10;
const compareColors = [
  '#0f8fff',
  '#ff5e4d',
  '#8c6112',
  '#ff9d2e',
  '#c2ab00',
  '#33a02c',
  '#eb52d6',
  '#707070',
  '#00ad91',
  '#bc80bd',
];

const setInteractions = ({
  agencies,
  dataProbe,
  nationalDataView,
  comparedAgencies,
  compareMode,
  updateHighlightedAgencies,
  jumpToMsa,
  updateComparedAgencies,
  mapContainer,
  allNationalMapData,
  indicator,
  mobile,
  embedded,
  years,
}) => {
  const {
    getMSAData,
    drawMSASparkline,
  } = atlasHelperFunctions;
  const tooltip = new DataProbe({
    container: d3.select('.outer-container'),
  });
  const formatPct = number => ([null, undefined].includes(number) ? 'N/A' : `${d3.format(',d')(number)}%`);
  const drawProbe = (d) => {
    d3.event.stopPropagation();
    const { clientX, clientY } = d3.event;
    const pos = {
      left: clientX < window.innerWidth - 310 ? (clientX + 10) : clientX - 310,
      bottom: window.innerHeight - clientY + 10,
      width: 300,
    };
    tooltip.remove();
    const ids = comparedAgencies.map(a => a.globalId);


    const format = number => ([null, undefined].includes(number) ? 'N/A'
      : (d3.format(indicator.format)(number) + (indicator.unit || '')));
    let clickText;
    if (mobile) {
      clickText = 'Jump to this MSA';
    } else {
      clickText = compareMode === false
        ? 'Click the point to jump to this MSA'
        : `Click the point to ${ids.includes(d.globalId) ? 'remove from' : 'add to'} comparison`;
      if (compareMode && comparedAgencies.length === 10 && !ids.includes(d.globalId)) {
        const oldest = comparedAgencies[maxCompared - 1];
        clickText = `${clickText}<br><br><i class="fa fa-exclamation-triangle"></i> 
          A maximum of 10 ${nationalDataView === 'msa' ? 'MSAs' : 'agencies'} may be compared. 
          Adding this ${nationalDataView === 'msa' ? 'MSA' : 'agency'} will remove
          <strong>${nationalDataView === 'msa' ? oldest.name : oldest.taName}</strong> from the comparison.`;
      }
    }
    const html = nationalDataView === 'msa' ? `
        <div class="data-probe__row"><span class="data-probe__field data-probe__name">${d.name}</span></div>
        <div class="data-probe__row"><span class="data-probe__field">${d.actualYearRange[0]}:</span> ${format(d.firstAndLast[0])}</div>
        <div class="data-probe__row"><span class="data-probe__field">${d.actualYearRange[1]}:</span> ${format(d.firstAndLast[1])}</div>
        <div class="data-probe__row"><span class="data-probe__field">${d.actualYearRange.join('–')} (% change):</span> ${formatPct(d.pctChange)}</div>
        <div class="data-probe__sparkline-container expanded"></div>
        <div class="data-probe__row data-probe__msa-text">${clickText}</div>
      ` : `
        <div class="data-probe__row"><span class="data-probe__field data-probe__name">${d.taName}</span></div>
        <div class="data-probe__row">${d.msaName}</div>            
        <div class="data-probe__row"><span class="data-probe__field">${d.actualYearRange[0]}:</span> ${format(d.firstAndLast[0])}</div>
        <div class="data-probe__row"><span class="data-probe__field">${d.actualYearRange[1]}:</span> ${format(d.firstAndLast[1])}</div>
        <div class="data-probe__row"><span class="data-probe__field">${d.actualYearRange.join('–')} (% change):</span> ${formatPct(d.pctChange)}</div>
        <div class="data-probe__sparkline-container expanded"></div>
        <div class="data-probe__row data-probe__msa-text">${clickText}</div>
      `;
    dataProbe
      .config({
        pos,
        html,
      })
      .draw();
    if (mobile) {
      d3.select('.data-probe__msa-text')
        .on('click', () => {
          dataProbe.remove();
          jumpToMsa(d);
        });
    }
  };
  if (compareMode === true) {
    mapContainer
      .on('mouseover.compare', () => {
        const { clientX, clientY } = d3.event;
        const pos = {
          left: clientX < window.innerWidth - 310 ? (clientX + 10) : clientX - 310,
          bottom: window.innerHeight - clientY + 10,
          width: 300,
        };
        let html = `Select a${nationalDataView === 'msa' ? 'n MSA' : ' transit agency'} to compare.`;
        if (comparedAgencies.length === maxCompared) {
          const oldest = comparedAgencies[maxCompared - 1];
          html = `${html}<br><br><i class="fa fa-exclamation-triangle"></i> 
          A maximum of 10 ${nationalDataView === 'msa' ? 'MSAs' : 'agencies'} may be compared. 
          Selecting a new ${nationalDataView === 'msa' ? 'MSA' : 'agency'} will remove
          <strong>${nationalDataView === 'msa' ? oldest.name : oldest.taName}</strong> from the comparison.`;
        }
        tooltip
          .config({
            pos,
            html,
          })
          .draw();
      })
      .on('mousemove.compare', () => {
        const { clientX, clientY } = d3.event;
        const pos = {
          left: clientX < window.innerWidth - 310 ? (clientX + 10) : clientX - 310,
          bottom: window.innerHeight - clientY + 10,
          width: 300,
        };
        tooltip
          .config({
            pos,
          })
          .setPos(pos);
      })
      .on('mouseout.compare', () => {
        tooltip.remove();
      });
  } else {
    mapContainer.on('mouseover.compare mousemove.compare mouseout.compare', null);
  }

  agencies
    .on('mouseout', () => {
      if (mobile) return;
      dataProbe.remove();
      updateHighlightedAgencies([]);
      agencies.classed('map__agency-dim', false);
    })
    .on('click', (d) => {
      if (embedded) return;
      if (mobile) {
        dataProbe.remove();
        drawProbe(d);
        return;
      }
      if (compareMode === false) {
        jumpToMsa(d);
      } else {
        const ids = comparedAgencies.map(a => a.globalId);
        if (ids.includes(d.globalId)) {
          // remove
          const newCompare = comparedAgencies.filter(a => a.globalId !== d.globalId);
          updateComparedAgencies(newCompare);
        } else {
          const comparedCopy = [...comparedAgencies];
          if (comparedAgencies.length === maxCompared) {
            comparedCopy.pop();
          }
          const currentColors = comparedAgencies.map(a => a.compareColor);
          const newColor = compareColors.find(c => !currentColors.includes(c));
          updateComparedAgencies([{ compareColor: newColor, ...d }, ...comparedCopy]);
        }
        dataProbe.remove();
      }
    })
    .on('mouseover', (d) => {
      if (mobile) return;
      const { globalId } = d;
      const msa = getMSAData({ allNationalMapData, globalId });
      agencies.classed('map__agency-dim', false);

      agencies.filter(a => a.msaId !== d.msaId)
        .classed('map__agency-dim', true);
      drawProbe(d);
      if (d.pctChange !== null) {
        drawMSASparkline({
          years,
          msa,
          indicator,
          highlightedId: d.globalId,
          container: dataProbe.getContainer().select('.data-probe__sparkline-container'),
        });
      }
      updateHighlightedAgencies([d]);
    });
};

export default setInteractions;
