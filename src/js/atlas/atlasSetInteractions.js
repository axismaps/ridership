import DataProbe from '../dataProbe/dataProbe';
import atlasHelperFunctions from './atlasHelperFunctions';

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
  years,
  allNationalMapData,
  indicator,
  mobile,
  embedded,
}) => {
  const {
    getMSAData,
    drawMSASparkline,
  } = atlasHelperFunctions;
  const tooltip = new DataProbe({
    container: d3.select('.outer-container'),
  });
  const formatPct = number => (number === null ? 'N/A' : `${d3.format(',d')(number)}%`);
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


    const format = number => (number === null ? 'N/A'
      : (d3.format(indicator.format)(number) + (indicator.unit || '')));
    let clickText;
    if (mobile) {
      clickText = 'Jump to this MSA';
    } else {
      clickText = compareMode === false
        ? 'Click the point to jump to this MSA'
        : `Click the point to ${ids.includes(d.globalId) ? 'remove from' : 'add to'} comparison`;
    }
    const html = nationalDataView === 'msa' ? `
        <div class="data-probe__row"><span class="data-probe__field data-probe__name">${d.name}</span></div>
        <div class="data-probe__row"><span class="data-probe__field">${years[0]}:</span> ${format(d.firstAndLast[0])}</div>
        <div class="data-probe__row"><span class="data-probe__field">${years[1]}:</span> ${format(d.firstAndLast[1])}</div>
        <div class="data-probe__row"><span class="data-probe__field">${years.join('–')} (% change):</span> ${formatPct(d.pctChange)}</div>
        <div class="data-probe__sparkline-container expanded"></div>
        <div class="data-probe__row data-probe__msa-text">${clickText}</div>
      ` : `
        <div class="data-probe__row"><span class="data-probe__field data-probe__name">${d.taName}</span></div>
        <div class="data-probe__row">${d.msaName}</div>            
        <div class="data-probe__row"><span class="data-probe__field">${years[0]}:</span> ${format(d.firstAndLast[0])}</div>
        <div class="data-probe__row"><span class="data-probe__field">${years[1]}:</span> ${format(d.firstAndLast[1])}</div>
        <div class="data-probe__row"><span class="data-probe__field">${years.join('–')} (% change):</span> ${formatPct(d.pctChange)}</div>
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
        const html = `Select a${nationalDataView === 'msa' ? 'n MSA' : ' transit agency'} to compare.`;
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
          updateComparedAgencies([d, ...comparedAgencies]);
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
