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
  }) {
    const indicatorData = Object.assign({}, indicator);
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
      return agencyCopy;
    });

    return new SparkLine({
      container,
      indicatorData,
      yearRange: [2006, 2017],
    });
  },
};

export default atlasHelperFunctions;
