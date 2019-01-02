const getGetCurrentNationalData = ({ data }) => function getCurrentNationalData() {
  const nationalNtd = data.get('nationalNtd');
  const years = this.get('years');
  const indicator = this.get('indicator');


  const firstRecord = nationalNtd.find(d => d.year === years[0])[indicator.value];
  const lastRecord = nationalNtd.find(d => d.year === years[1])[indicator.value];
  const pctChange = [firstRecord, lastRecord].includes(null) ? null
    : 100 * (lastRecord - firstRecord) / firstRecord;
  const firstAndLast = [firstRecord, lastRecord];

  return {
    pctChange,
    firstAndLast,
    ntd: nationalNtd,
  };
};

export default getGetCurrentNationalData;
