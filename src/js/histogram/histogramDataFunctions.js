const dataFunctions = {
  getHistogramData({
    nationalMapData,
    bucketCount,
    nationalDataView,
    nationalNtd,
    nationalData,
    years,
  }) {
    const allAgencies = nationalDataView === 'msa' ? nationalMapData.slice()
      : nationalMapData
        .reduce((accumulator, msa) => [...accumulator, ...msa.ta], [])
        .filter(d => d.pctChange < 500);

    const nationalAverage = nationalData.pctChange;

    const changeSpan = d3.extent(allAgencies, d => d.pctChange);

    const bucketSize = (changeSpan[1] - changeSpan[0]) / bucketCount;

    const histogramData = new Array(bucketCount)
      .fill(null)
      .map((d, i) => {
        const bucket = [
          changeSpan[0] + (i * bucketSize),
          changeSpan[0] + (i * bucketSize) + bucketSize,
        ];
        const agencies = allAgencies
          .filter((agency) => {
            if (agency.pctChange === null) return false;
            if (i === 0) {
              return agency.pctChange >= bucket[0]
                && agency.pctChange - bucket[1] <= 0.00001;
            }
            return agency.pctChange > bucket[0]
              && agency.pctChange - bucket[1] <= 0.00001;
          });
        // const bucket = {};
        // bucket.index = i;
        return {
          bucket,
          records: agencies,
          count: agencies.length,
          index: i,
        };
      });
    return { histogramData, nationalAverage };
  },
  getMSAHistogramData({
    tractGeo,
    bucketCount,
    currentCensusField,
  }) {
    const tracts = tractGeo.features.map(d => d.properties);
    const changeSpan = d3.extent(tracts, d => d[currentCensusField.value] * 100);

    const bucketSize = (changeSpan[1] - changeSpan[0]) / bucketCount;
    const msaHistogramData = new Array(bucketCount)
      .fill(null)
      .map((d, i) => {
        const bucket = [
          changeSpan[0] + (i * bucketSize),
          changeSpan[0] + (i * bucketSize) + bucketSize,
        ];
        const records = tracts
          .filter((tract) => {
            if (i === 0) {
              return tract[currentCensusField.value] * 100 >= bucket[0]
                && tract[currentCensusField.value] * 100 - bucket[1] <= 0.00001;
            }
            return tract[currentCensusField.value] * 100 > bucket[0]
              && tract[currentCensusField.value] * 100 - bucket[1] <= 0.00001;
          });
        // const bucket = {};
        // bucket.index = i;
        return {
          bucket,
          records,
          count: records.length,
          index: i,
        };
      });
    return msaHistogramData;
  },
};

export default dataFunctions;
