const getGetCurrentNationalData = ({ data }) => function getCurrentNationalData() {
  const nationalNtd = data.get('nationalNtd');
  const years = this.get('years');
  const indicator = this.get('indicator');


  const firstRecord = nationalNtd.find(d => d.year === years[0]);
  const lastRecord = nationalNtd.find(d => d.year === years[1]);
  const firstValue = firstRecord ? firstRecord[indicator.value] : null;
  const lastValue = lastRecord ? lastRecord[indicator.value] : null;

  const pctChange = [firstValue, lastValue].includes(null) ? null
    : 100 * (lastValue - firstValue) / firstValue;
  const firstAndLast = [firstValue, lastValue];

  return {
    pctChange,
    firstAndLast,
    ntd: nationalNtd,
  };
};

export default getGetCurrentNationalData;
