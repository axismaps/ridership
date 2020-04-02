/**
 * Data for PCP
 * @orivate
 */

const getGetCurrentAgenciesData = ({ data }) => function getCurrentAgenciesData() {
  const nationalMapData = data.get('allNationalMapData');
  const indicatorSummaries = this.getCurrentIndicatorSummaries();

  const years = this.get('years');
  // in case start = end wehn a nominal value indicator is selected
  const yearsToUse = [years[0], Math.max(years[1], years[0] + 1)];
  const taFilter = this.get('taFilter');

  const inYears = d => d.year >= yearsToUse[0] && d.year <= yearsToUse[1];
  const comparedAgencies = this.get('comparedAgencies');
  const nationalDataView = this.get('nationalDataView');
  const currentScale = this.get('scale');
  const currentMSA = this.get('msa');
  const yearRange = currentScale === 'msa' ? data.get('msaYearRange') : data.get('yearRange');

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

  const noRecord = d => [0, null, undefined].includes(d);

  if (nationalDataView === 'ta' || currentScale === 'msa') {
    const taIds = comparedAgencies.map(d => d.taId);
    return nationalMapData.map(msa => msa.ta
      .filter((agency) => {
        let include = agency.ntd.filter(inYears).length > 0;
        if (taIds.length > 0 && taIds.includes(agency.taId) === false) {
          include = false;
        }
        return include;
      })
      .filter(agency => !taFilter.has(agency.taId))
      .map((agency) => {
        const {
          msaId,
          taId,
          taName,
          taShort,
          globalId,
          color,
        } = agency;
        const agencyCopy = {
          msaId,
          taId,
          taName,
          taShort,
          globalId,
          color,
        };
        if (comparedAgencies.length) {
          const compared = comparedAgencies.find(a => a.globalId === agency.globalId);
          agencyCopy.compareColor = compared.compareColor;
        }
        const agencyIndicators = indicatorSummaries.map((indicator) => {
          const {
            text,
            value,
            format,
            unit,
          } = indicator;
          const indicatorCopy = {
            text,
            value,
            format,
            unit,
          };

          const records = {};
          for (let year = yearRange[0]; year <= yearRange[1]; year += 1) {
            records[year] = agency.ntd.find(d => d.year === year)[indicator.value];
          }

          const firstYearData = getNearestYearValue(years[0], records, true);
          const lastYearData = getNearestYearValue(years[1], records, false);
          const firstRecord = records[years[0]];
          const lastRecord = records[years[1]];
          const firstYear = years[0];
          const lastYear = years[1];

          const pctChange = noRecord(firstRecord) || noRecord(lastRecord) || firstYear === lastYear
            ? null
            : ((lastRecord - firstRecord)
              / firstRecord) * 100;

          Object.assign(indicatorCopy, {
            pctChange,
            actualYearRange: [firstYear, lastYear],
            firstAndLast: [firstRecord, lastRecord],
          });

          return indicatorCopy;
        });
        Object.assign(agencyCopy, {
          indicators: agencyIndicators,
        });
        return agencyCopy;
      }))
      .filter(msa => msa.length > 0)
      .reduce((accumulator, msa) => [...accumulator, ...msa], [])
      .filter((ta) => {
        if (currentScale === 'msa') {
          return ta.msaId === currentMSA.msaId;
        }
        return true;
      });
  }

  // by MSA
  const msaIds = comparedAgencies.map(d => d.msaId);
  return nationalMapData
    .filter(msa => msa.ntd.filter(inYears).length > 0)
    .map((msa) => {
      const {
        msaId,
        globalId,
        name,
      } = msa;
      const msaCopy = {
        msaId,
        globalId,
        name,
      };

      if (comparedAgencies.length) {
        const compared = comparedAgencies.find(a => a.globalId === msa.globalId);
        msaCopy.compareColor = compared.compareColor;
      }

      msaCopy.indicators = indicatorSummaries.map((indicator) => {
        const {
          text,
          value,
          format,
          unit,
        } = indicator;
        const indicatorCopy = {
          text,
          value,
          format,
          unit,
        };
        const records = {};
        for (let year = yearRange[0]; year <= yearRange[1]; year += 1) {
          records[year] = msa.ntd.find(d => d.year === year)[indicator.value];
        }
        const firstYearData = getNearestYearValue(years[0], records, true);
        const lastYearData = getNearestYearValue(years[1], records, false);

        const firstRecord = records[years[0]];
        const lastRecord = records[years[1]];
        const firstYear = years[0];
        const lastYear = years[1];


        if (!noRecord(firstRecord) && !noRecord(lastRecord) && firstYear !== lastYear) {
          indicatorCopy.pctChange = 100 * (lastRecord - firstRecord) / firstRecord;
        } else {
          indicatorCopy.pctChange = null;
        }

        Object.assign(indicatorCopy, {
          actualYearRange: [firstYear, lastYear],
          firstAndLast: [firstRecord, lastRecord],
        });

        return indicatorCopy;
      });
      return msaCopy;
    })
    .filter(msa => msaIds.length === 0 || msaIds.includes(msa.msaId));
};

export default getGetCurrentAgenciesData;
