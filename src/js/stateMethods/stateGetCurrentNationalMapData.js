const getGetCurrentNationalMapData = ({ data }) => function getCurrentNationalMapData() {
  const nationalMapData = data.get('allNationalMapData');

  const years = this.get('years');

  const indicator = this.get('indicator');
  const inYears = d => d.year >= years[0] && d.year <= years[1];

  return nationalMapData.map((msa) => {
    const msaCopy = Object.assign({}, msa);
    msaCopy.ta = msa.ta
      .filter(agency => agency.ntd.filter(inYears).length > 0)
      .map((agency) => {
        const {
          cent,
          msaId,
          taId,
          taName,
          taShort,
          globalId,
        } = agency;
        const agencyCopy = {
          cent,
          msaId,
          taId,
          taName,
          taShort,
          globalId,
        };

        // const ntdRecords = agency.ntd.filter(inYears);
        const ntd2017 = agency.ntd.find(d => d.year === 2017);

        const firstRecord = agency.ntd.find(d => d.year === years[0])[indicator.value];
        const lastRecord = agency.ntd.find(d => d.year === years[1])[indicator.value];

        const noRecord = d => [0, null].includes(d);

        const pctChange = noRecord(firstRecord)
          ? null
          : ((lastRecord - firstRecord)
            / firstRecord) * 100;
        // const indicatorValue = d3.sum(ntdRecords, d => d[indicator]);
        // const uptTotal = d3.sum(ntdRecords, d => d.upt);

        Object.assign(agencyCopy, {
          // indicatorValue,
          pctChange,
          // uptTotal,
          upt2017: ntd2017.upt,
          msaName: msa.name,
          taName: agency.taName,
          taShort: agency.taShort,
          firstAndLast: [firstRecord, lastRecord],
        });
        return agencyCopy;
      })
      .filter(agency => agency.uptTotal !== 0);

    const msaFirstRecords = msa.ta.map((ta) => {
      const record = ta.ntd.find(d => d.year === years[0])[indicator.value];
      return record;
    })
      .filter(d => d !== null);
    const msaLastRecords = msa.ta.map((ta) => {
      const record = ta.ntd.find(d => d.year === years[1])[indicator.value];
      return record;
    })
      .filter(d => d !== null);
    msaCopy.upt2017 = d3.sum(msaCopy.ta.map(ta => ta.upt2017));
    const summaries = [
      d3[indicator.summaryType](msaFirstRecords) || null,
      d3[indicator.summaryType](msaLastRecords) || null,
    ];
    if (!summaries.includes(null)) {
      msaCopy.pctChange = 100 * (summaries[1] - summaries[0]) / summaries[0];
    } else {
      msaCopy.pctChange = null;
    }
    msaCopy.firstAndLast = summaries;
    return msaCopy;
  })
    .filter(msa => msa.ta.length > 0);
};

export default getGetCurrentNationalMapData;
