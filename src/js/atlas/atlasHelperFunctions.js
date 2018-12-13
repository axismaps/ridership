import SparkLine from '../sparkLine/sparkLine';

const atlasHelperFunctions = {
  getAllAgencies({
    nationalMapData,
  }) {
    return nationalMapData
      .reduce((accumulator, msa) => [...accumulator, ...msa.ta], [])
      .sort((a, b) => b.upt2017 - a.upt2017);
  },

  getMSAData({
    allNationalMapData,
    globalId,
  }) {
    return allNationalMapData.filter(msa => msa.globalId === globalId
     || msa.ta.map(ta => ta.globalId).includes(globalId))[0];
  },

  drawMSASparkline({
    msa,
    indicator,
    container,
    highlightedId,
  }) {
    const indicatorData = Object.assign({}, indicator);
    if (msa.globalId === highlightedId) {
      indicatorData.agencies = [{
        msaId: msa.msaId,
        globalId: msa.globalId,
        color: 'rgba(0,0,0,1)',
      }];
      indicatorData.agencies[0].summaries = msa.ta[0].ntd.map((d) => {
        const { year } = d;
        const indicatorSummary = d3[indicator.summaryType](
          msa.ta.map(ta => ta.ntd.find(record => record.year === year)[indicator.value]),
        );
        return { year, indicatorSummary };
      });
    } else {
      indicatorData.agencies = msa.ta.map((ta) => {
        const {
          msaId,
          taId,
          globalId,
        } = ta;
        const agencyCopy = {
          msaId,
          taId,
          globalId,
        };
        agencyCopy.summaries = ta.ntd.map((d) => {
          const { year } = d;
          const indicatorSummary = d[indicator.value];
          return {
            year,
            indicatorSummary,
          };
        });
        agencyCopy.color = globalId === highlightedId || msa.globalId === highlightedId ? 'rgba(0,0,0,1)' : 'rgba(0,0,0,.25)';
        return agencyCopy;
      });
    }

    return new SparkLine({
      container,
      indicatorData,
      yearRange: [2006, 2017],
      color: true,
    });
  },
};

export default atlasHelperFunctions;
