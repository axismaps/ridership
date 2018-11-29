const histogramFunctions = {
  getHistogramData({
    nationalMapData,
    bucketCount,
  }) {
    console.log('national map data', nationalMapData);

    const allAgencies = nationalMapData
      .reduce((accumulator, msa) => [...accumulator, ...msa.ta], [])
      .filter(d => d.pctChange < 500); // filter out crazy outliers...

    const changeSpan = d3.extent(allAgencies, d => d.pctChange);
    console.log('span', changeSpan);
    // allAgencies.forEach((d) => {
    //   if (d.pctChange > 100) {
    //     console.log(d, d.pctChange);
    //   }
    // });
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
            if (i === 0) {
              return agency.pctChange >= bucket[0]
                && agency.pctChange <= bucket[1];
            }
            return agency.pctChange > bucket[0]
              && agency.pctChange <= bucket[1];
          });
        // const bucket = {};
        // bucket.index = i;
        return {
          bucket,
          agencies,
          count: agencies.length,
          index: i,
        };
      });
    return histogramData;
  },
  getScales({
    width,
    height,
    histogramData,
  }) {
    const yDomain = d3.extent(histogramData, d => d.count);
    // const yRange =
  },
};

export default histogramFunctions;
