import State from '../state/state';

const getState = ({ data }) => {
  const state = new State({
    mobile: false,
    msa: null, // for msa view
    msaProbe: null, // probed msa in national view
    indicator: data.get('indicators').get('headways'),
    // years: data.get('yearRange'),
    years: [2013, 2015],
    agenciesOn: true,
    nationalDataView: 'ta', // ta or msa
    scale: 'national', // national or msa,
    censusField: { text: 'Income', value: 'income' },
    distanceFilter: null,
    highlightedAgencies: [], // agencies highlighted on map/histogram/chart(s) mouseover,
    expandedIndicator: null,
    comparedAgencies: [],
  });

  state.getCurrentNationalMapData = function getCurrentNationalMapData() {
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
      if (msaFirstRecords.length > 0 && msaLastRecords.length > 0) {
        const summaries = [
          d3[indicator.summaryType](msaFirstRecords),
          d3[indicator.summaryType](msaLastRecords),
        ];
        msaCopy.pctChange = 100 * (summaries[1] - summaries[0]) / summaries[0];
      } else {
        msaCopy.pctChange = null;
      }
      return msaCopy;
    })
      .filter(msa => msa.ta.length > 0);
  };
  state.getCurrentAgenciesData = function getCurrentAgenciesData() {
    const nationalMapData = data.get('allNationalMapData');
    const indicatorSummaries = state.getCurrentIndicatorSummaries();

    const years = this.get('years');

    const inYears = d => d.year >= years[0] && d.year <= years[1];
    const comparedAgencies = state.get('comparedAgencies');
    const nationalDataView = state.get('nationalDataView');

    if (nationalDataView === 'ta') {
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
          } = agency;
          const agencyCopy = {
            msaId,
            taId,
            taName,
            taShort,
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
        .reduce((accumulator, msa) => [...accumulator, ...msa], []);
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
  state.getCurrentCompareData = function getCurrentCompareData() {
    // const nationalMapData = data.get('allNationalMapData');
    // const years = this.get('years');
    return null;
    // const nationalMapData = data.get('allNationalMapData');
    // const indicatorSummaries = data.get('indicatorSummaries');

    // const years = this.get('years');

    // const inYears = d => d.year >= years[0] && d.year <= years[1];

    // return nationalMapData.map(msa => msa.ta
    //   .filter(agency => agency.ntd.filter(inYears).length > 0)
    //   .map((agency) => {
    //     const {
    //       msaId,
    //       taId,
    //       taName,
    //       taShort,
    //     } = agency;
    //     const agencyCopy = {
    //       msaId,
    //       taId,
    //       taName,
    //       taShort,
    //     };
    //     const agencyIndicators = indicatorSummaries.map((indicator) => {
    //       const {
    //         text,
    //         value,
    //       } = indicator;
    //       const indicatorCopy = {
    //         text,
    //         value,
    //       };
    //       const firstRecord = agency.ntd.find(d => d.year === years[0])[value];
    //       const lastRecord = agency.ntd.find(d => d.year === years[1])[value];
    //       const noRecord = d => [null].includes(d);
    //       const pctChange = noRecord(firstRecord)
    //         ? null
    //         : ((lastRecord - firstRecord)
    //             / firstRecord) * 100;

    //       Object.assign(indicatorCopy, {
    //         pctChange,
    //       });

    //       return indicatorCopy;
    //     });
    //     Object.assign(agencyCopy, {
    //       indicators: agencyIndicators,
    //     });
    //     return agencyCopy;
    //   }))
    //   .filter(msa => msa.length > 0)
    //   .reduce((accumulator, msa) => [...accumulator, ...msa], []);
  };

  state.getCurrentIndicatorSummaries = function getCurrentIndicatorSummaries() {
    const comparedAgencies = state.get('comparedAgencies');
    const nationalDataView = state.get('nationalDataView');
    const ids = comparedAgencies.map(d => d[`${nationalDataView}Id`]);
    const allNationalMapData = data.get('allNationalMapData');
    const records = allNationalMapData.map((msa) => {
      const msaRecords = msa.ta.map(ta => ta.ntd)
        .reduce((accumulator, ta) => [...accumulator, ...ta], []);
      return msaRecords;
    })
      .reduce((accumulator, msa) => [...accumulator, ...msa], [])
      .filter(d => ids.length === 0 || ids.includes(d[`${nationalDataView}Id`]));
    const yearRange = data.get('yearRange');
    const indicators = data.get('indicators');
    const indicatorSummaries = [];
    {
      const recordsPerYear = new Map();
      for (let i = 0; i < yearRange[1] - yearRange[0]; i += 1) {
        const year = yearRange[0] + i;
        const recordsForYear = records.filter(d => d.year === year);
        recordsPerYear.set(year, recordsForYear);
      }
      indicators.forEach((indicator, key) => {
        const indicatorCopy = Object.assign({}, indicator);
        indicatorCopy.agencies = [];
        const agencies = comparedAgencies.length === 0
          ? [{
            taId: 'all',
            msaId: 'all',
            globalId: 'all',
            summaries: [],
          }]
          : comparedAgencies.map(a => Object.assign({ summaries: [] }, a));
        agencies.forEach((agency) => {
          for (let i = 0; i < yearRange[1] - yearRange[0]; i += 1) {
            const year = yearRange[0] + i;
            const recordsForYear = recordsPerYear.get(year)
              .filter(d => d[key] !== null
                && Number.isFinite(d[key])
                && (agency[`${nationalDataView}Id`] === 'all' || agency[`${nationalDataView}Id`] === d[`${nationalDataView}Id`]));
            const indicatorSummary = d3[indicator.summaryType](recordsForYear, d => d[key]);
            const summary = {
              year,
              indicatorSummary,
            };
            if (indicatorSummary !== undefined) {
              agency.summaries.push(summary);
            }
          }
          indicatorCopy.agencies.push(agency);
        });

        indicatorSummaries.push(indicatorCopy);
      });
    }
    return indicatorSummaries;
  };

  return state;
};

export default getState;
