const getGetCurrentNationalMapData = ({ data }) => function getCurrentNationalMapData() {
  const nationalMapData = data.get('allNationalMapData');

  const years = this.get('years');
  const yearRange = data.get('yearRange');

  const indicator = this.get('indicator');
  const inYears = d => d.year >= years[0] && d.year <= years[1];
  const noRecord = d => [0, null, undefined].includes(d);

  const getNearestYearValue = (year, records, isFirstYear) => {
    let value = records[year];
    let i = 1;
    let currentYear = year;
    while (!value) {
      const increment = isFirstYear ? i : -i;
      currentYear = year + increment;
      value = records[currentYear];
      if (value) break;
      currentYear = year - increment;
      value = records[currentYear];
      if (isFirstYear && year + i >= years[1] && year - i < yearRange[0]) break;
      if (!isFirstYear && year - i <= years[0] && year + i > yearRange[1]) break;
      i += 1;
    }
    return {
      value,
      year: currentYear,
    };
  };

  return nationalMapData.map((msa) => {
    const msaCopy = Object.assign({}, msa);
    msaCopy.ta = msa.ta
      .filter(agency => agency.ntd.filter(inYears).length > 0)
      .map((agency, i) => {
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

        const records = {};
        for (let year = yearRange[0]; year <= yearRange[1]; year += 1) {
          records[year] = agency.ntd.find(d => d.year === year)[indicator.value];
        }

        const firstYearData = getNearestYearValue(years[0], records, true);
        const lastYearData = getNearestYearValue(years[1], records, false);

        const firstRecord = firstYearData.value;
        const lastRecord = lastYearData.value;
        const firstYear = firstYearData.value ? firstYearData.year : years[0];
        const lastYear = lastYearData.value ? lastYearData.year : years[1];

        const pctChange = noRecord(firstRecord) || noRecord(lastRecord) || firstYear === lastYear
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
          actualYearRange: [firstYear, lastYear],
        });
        return agencyCopy;
      })
      .filter(agency => agency.uptTotal !== 0);

    const records = {};
    for (let year = yearRange[0]; year <= yearRange[1]; year += 1) {
      records[year] = msa.ntd.find(d => d.year === year)[indicator.value];
    }
    const firstYearData = getNearestYearValue(years[0], records, true);
    const lastYearData = getNearestYearValue(years[1], records, false);

    const msaFirstRecord = firstYearData.value;
    const msaLastRecord = lastYearData.value;
    const firstYear = firstYearData.value ? firstYearData.year : years[0];
    const lastYear = lastYearData.value ? lastYearData.year : years[1];

    msaCopy.upt2017 = msa.ntd.find(d => d.year === 2017).upt;
    if (![msaFirstRecord, msaLastRecord].includes(null) && firstYear !== lastYear) {
      msaCopy.pctChange = 100 * (msaLastRecord - msaFirstRecord) / msaFirstRecord;
    } else {
      msaCopy.pctChange = null;
    }
    msaCopy.firstAndLast = [msaFirstRecord, msaLastRecord];
    msaCopy.actualYearRange = [firstYear, lastYear];
    return msaCopy;
  })
    .filter(msa => msa.ta.length > 0);
};

export default getGetCurrentNationalMapData;
