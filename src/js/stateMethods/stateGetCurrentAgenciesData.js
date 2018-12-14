const getGetCurrentAgenciesData = ({ data }) => function getCurrentAgenciesData() {
  const nationalMapData = data.get('allNationalMapData');
  const indicatorSummaries = this.getCurrentIndicatorSummaries();

  const years = this.get('years');

  const inYears = d => d.year >= years[0] && d.year <= years[1];
  const comparedAgencies = this.get('comparedAgencies');
  const nationalDataView = this.get('nationalDataView');
  const currentScale = this.get('scale');
  const currentMSA = this.get('msa');

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
      .map((agency) => {
        const {
          msaId,
          taId,
          taName,
          taShort,
          globalId,
        } = agency;
        const agencyCopy = {
          msaId,
          taId,
          taName,
          taShort,
          globalId,
        };
        const agencyIndicators = indicatorSummaries.map((indicator) => {
          const {
            text,
            value,
          } = indicator;
          const indicatorCopy = {
            text,
            value,
          };
          const firstRecord = agency.ntd.find(d => d.year === years[0])[value];
          const lastRecord = agency.ntd.find(d => d.year === years[1])[value];
          const noRecord = d => [null].includes(d);
          const pctChange = noRecord(firstRecord)
            ? null
            : ((lastRecord - firstRecord)
                  / firstRecord) * 100;

          Object.assign(indicatorCopy, {
            pctChange,
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
  return nationalMapData.map((msa) => {
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
    msaCopy.indicators = indicatorSummaries.map((indicator) => {
      const {
        text,
        value,
      } = indicator;
      const indicatorCopy = {
        text,
        value,
      };
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
      if (msaFirstRecords.length > 0 && msaLastRecords.length > 0) {
        const summaries = [
          d3[indicator.summaryType](msaFirstRecords),
          d3[indicator.summaryType](msaLastRecords),
        ];
        Object.assign(indicatorCopy, {
          pctChange: 100 * (summaries[1] - summaries[0]) / summaries[0],
        });
      } else {
        Object.assign(indicatorCopy, {
          pctChange: null,
        });
      }
      return indicatorCopy;
    });
    return msaCopy;
  })
    .filter(msa => msaIds.length === 0 || msaIds.includes(msa.msaId));
};

export default getGetCurrentAgenciesData;
