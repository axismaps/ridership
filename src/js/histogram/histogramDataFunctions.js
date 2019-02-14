const getData = ({
  records,
  bucketCount,
  getValue,
}) => {
  const roundToFive = d => Math.round(d / 5) * 5;
  const changeSpan = d3.extent(records, getValue);
  const changeSpanUse = changeSpan.map((d, i) => {
    let num = roundToFive(d);
    if (num % 10 === 0) {
      if (i === 0) {
        num -= 5;
      } else if (i === 1) {
        num += 5;
      }
    }

    if (i === 0 && num < -295) {
      return -305;
    }

    if (i === 1 && num > 295) {
      return 305;
    }
    return num;
  });


  const getBucketSize = () => {
    const testSize = roundToFive((changeSpanUse[1] - changeSpanUse[0]) / bucketCount);
    if (testSize < 5) return 5;
    if (testSize > 10) return 10;
    return testSize;
  };

  const bucketSize = getBucketSize();
  const histogramData = [];
  const recordsTracker = [];
  let counter = 0;
  for (let i = changeSpanUse[0]; i < changeSpanUse[1]; i += bucketSize) {
    const bucket = [
      i,
      i + bucketSize,
    ];
    const agencies = records
      .filter((record) => {
        const value = getValue(record);
        if (value === null) return false;
        if (recordsTracker.includes(record)) return false;
        if (bucket[0] === changeSpanUse[0]) {
          return value - bucket[1] <= 0.00001;
        }
        if (bucket[1] === changeSpanUse[1]) {
          return value - bucket[0] >= 0.00001;
        }
        return value > bucket[0]
          && value - bucket[1] <= 0.00001;
      });
    recordsTracker.push(...agencies);
    counter += 1;
    histogramData.push({
      bucket,
      records: agencies,
      count: agencies.length,
      index: counter,
    });
  }
  return histogramData;
};

const dataFunctions = {
  getHistogramData({
    nationalMapData,
    bucketCount,
    nationalDataView,
    nationalData,
  }) {
    const allAgencies = nationalDataView === 'msa' ? nationalMapData.slice()
      : nationalMapData
        .reduce((accumulator, msa) => [...accumulator, ...msa.ta], [])
        .filter(d => d.pctChange < 500);

    const nationalAverage = nationalData.pctChange;

    const histogramData = getData({
      records: allAgencies,
      bucketCount,
      getValue: d => d.pctChange,
    });

    return { histogramData, nationalAverage };
  },
  getMSAHistogramData({
    tractGeo,
    bucketCount,
    currentCensusField,
    distanceFilter,
  }) {
    const tracts = tractGeo.features
      .map(d => d.properties)
      .filter((d) => {
        if (distanceFilter !== null) {
          return d.dist <= distanceFilter.value;
        }
        return true;
      })
      .filter(d => Number.isFinite(d[currentCensusField.value]));
    const msaHistogramData = getData({
      bucketCount,
      records: tracts,
      getValue: d => d[currentCensusField.value] * 100,
    });
    // const changeSpan = d3.extent(tracts, d => d[currentCensusField.value] * 100);

    // const bucketSize = (changeSpan[1] - changeSpan[0]) / bucketCount;
    // const msaHistogramData = new Array(bucketCount)
    //   .fill(null)
    //   .map((d, i) => {
    //     const bucket = [
    //       changeSpan[0] + (i * bucketSize),
    //       changeSpan[0] + (i * bucketSize) + bucketSize,
    //     ];
    //     const records = tracts
    //       .filter((tract) => {
    //         if (i === 0) {
    //           return tract[currentCensusField.value] * 100 >= bucket[0]
    //             && tract[currentCensusField.value] * 100 - bucket[1] <= 0.00001;
    //         }
    //         return tract[currentCensusField.value] * 100 > bucket[0]
    //           && tract[currentCensusField.value] * 100 - bucket[1] <= 0.00001;
    //       });

    //     return {
    //       bucket,
    //       records,
    //       count: records.length,
    //       index: i,
    //     };
    //   });

    return msaHistogramData;
  },
};

export default dataFunctions;
