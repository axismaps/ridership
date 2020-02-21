/**
 * Data for PCP
 * @orivate
 */

const getGetCurrentAgenciesData = ({ data }) => function getCurrentAgenciesData() {
  const nationalMapData = data.get('allNationalMapData');
  const indicatorSummaries = this.getCurrentIndicatorSummaries();

  const years = this.get('years');
  const taFilter = this.get('taFilter');

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
          } = indicator;
          const indicatorCopy = {
            text,
            value,
          };
          const firstRecord = agency.ntd.find(d => d.year === years[0])[value];
          const lastRecord = agency.ntd.find(d => d.year === years[1])[value];
          const noRecord = d => [null].includes(d);
          const pctChange = noRecord(firstRecord) || noRecord(lastRecord)
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
        } = indicator;
        const indicatorCopy = {
          text,
          value,
        };
        const firstRecord = msa.ntd.find(d => d.year === years[0])[value];
        const lastRecord = msa.ntd.find(d => d.year === years[1])[value];
        const noRecord = d => [null].includes(d);
        const pctChange = noRecord(firstRecord) || noRecord(lastRecord)
          ? null
          : ((lastRecord - firstRecord)
                / firstRecord) * 100;

        Object.assign(indicatorCopy, {
          pctChange,
        });

        return indicatorCopy;
      });
      return msaCopy;
    })
    .filter(msa => msaIds.length === 0 || msaIds.includes(msa.msaId));
};

export default getGetCurrentAgenciesData;
