const getData = ({
  records,
  bucketCount,
  getValue,
  mobile,
  currentCensusField,
}) => {
  const roundTo = (d, n) => Math.round(d / n) * n;
  const span = d3.extent(records, getValue);
  const ticks = d3.ticks(span[0], span[1], bucketCount);

  const getBucketSize = () => {
    if (currentCensusField && !currentCensusField.change) {
      return ticks[1] - ticks[0];
    }
    const testSize = roundTo((span[1] - span[0]) / bucketCount, 10);
    let bucketSize;
    if (testSize < 5) {
      bucketSize = 5;
    } else if (testSize > 10) {
      bucketSize = 10;
    } else {
      bucketSize = testSize;
    }
    if (mobile) {
      bucketSize *= 2;
    }
    return bucketSize;
  };

  const bucketSize = getBucketSize();
  const spanUse = currentCensusField && !currentCensusField.change
    ? [ticks[0], ticks[ticks.length - 1]]
    : span.map((d, i) => {
      const num = roundTo(d, bucketSize);
      if (i === 0 && num < -295) {
        return -300;
      }

      if (i === 1 && num > 295) {
        return 300;
      }
      return num;
    });

  const histogramData = [];
  const recordsTracker = [];
  let counter = 0;
  for (let i = spanUse[0]; i < spanUse[1]; i += bucketSize) {
    const bucket = [
      i,
      i + bucketSize,
    ];
    const agencies = records
      .filter((record) => {
        const value = getValue(record);
        if (value === null) return false;
        if (recordsTracker.includes(record)) return false;
        if (bucket[0] === spanUse[0]) {
          return value - bucket[1] <= 0.00001;
        }
        if (bucket[1] === spanUse[1]) {
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
    mobile,
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
      mobile,
    });

    return { histogramData, nationalAverage };
  },
  getMSAHistogramData({
    tractGeo,
    regionCensus,
    bucketCount,
    currentCensusField,
    distanceFilter,
    mobile,
  }) {
    const tracts = tractGeo.features
      .map(d => d.properties)
      .filter((d) => {
        if (distanceFilter !== null) {
          return d.dist <= distanceFilter.value;
        }
        return true;
      })
      .filter(d => Number.isFinite(d[currentCensusField.id]));
    const histogramData = getData({
      bucketCount,
      records: tracts,
      mobile,
      currentCensusField,
      getValue: d => (currentCensusField.change
        ? (d[currentCensusField.id] * 100) : d[currentCensusField.id]),
    });

    // not national but keeping variable name consistent is easier
    const nationalAverage = regionCensus[currentCensusField.id] * (currentCensusField.change ? 100 : 1);

    return { histogramData, nationalAverage };
  },
};

export default dataFunctions;
