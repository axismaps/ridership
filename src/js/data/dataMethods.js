const dataMethods = {
  cleanData({ rawData }) {
    const [
      rawTa,
      rawMsa,
      rawNtd,
      rawStates,
    ] = rawData;

    const {
      getAllNationalMapData,
    } = dataMethods;

    const msa = rawMsa.rows.map((record) => {
      const {
        centx,
        centy,
        maxx,
        maxy,
        minx,
        miny,
        msaid,
        name,
      } = record;

      return {
        centX: centx,
        centY: centy,
        cent: [centx, centy],
        maxX: maxx,
        maxY: maxy,
        minX: minx,
        minY: miny,
        msaId: msaid.toString(),
        name,
      };
    });

    const ta = rawTa.rows.map((record) => {
      const {
        msaid,
        taid,
        taname,
        tashort,
      } = record;

      return {
        msaId: msaid.toString(),
        taId: taid.toString(),
        taName: taname,
        taShort: tashort,
      };
    });

    const ntd = rawNtd.rows.map((record) => {
      const cleanRecord = Object.assign({}, record);
      cleanRecord.taId = record.id.toString();
      return cleanRecord;
    });

    const allNationalMapData = getAllNationalMapData({
      msa,
      ntd,
      ta,
    });

    const yearRange = d3.extent(ntd, d => d.year);

    const changeColorScale = d3.scaleThreshold()
      .domain([-25, -5, 5, 25])
      .range([
        '#BC4E9F',
        '#E6B4D6',
        '#E2F1FD',
        '#8BD5D5',
        '#009093',
      ]);

    const indicators = new Map();

    {
      const indicatorList = [
        {
          text: 'Average Headways',
          value: 'headways',
          summaryType: 'mean',
        },
        {
          text: 'Average Fares',
          value: 'fares',
          summaryType: 'mean',
        },
        {
          text: 'Farebox Recovery',
          value: 'recovery',
          summaryType: 'sum',
        },
        {
          text: 'Bus Ridership',
          value: 'bus',
          summaryType: 'sum',
        },
        {
          text: 'Rail Ridership',
          value: 'rail',
          summaryType: 'sum',
        },
        {
          text: 'Operating Expenses (total)',
          value: 'total_oe',
          summaryType: 'sum',
        },
        {
          text: 'Vehicle Revenue Miles (per ride)',
          value: 'vrm_per_ride',
          summaryType: 'mean',
        },
        {
          text: 'Average Trip Length',
          value: 'trip_length',
          summaryType: 'mean',
        },
        {
          text: 'Unlinked Passenger Trips',
          value: 'upt',
          summaryType: 'sum',
        },
        {
          text: 'Average Speed',
          value: 'speed',
          summaryType: 'mean',
        },
        {
          text: 'Vehicle Revenue Miles (total)',
          value: 'vrm',
          summaryType: 'sum',
        },
      ];

      indicatorList.forEach((indicator) => {
        indicators.set(indicator.value, indicator);
      });
    }

    const indicatorSummaries = [];
    {
      const recordsPerYear = new Map();
      for (let i = 0; i < yearRange[1] - yearRange[0]; i += 1) {
        const year = yearRange[0] + i;
        const recordsForYear = ntd.filter(d => d.year === year);
        recordsPerYear.set(year, recordsForYear);
      }
      indicators.forEach((indicator, key) => {
        const indicatorCopy = Object.assign({}, indicator);
        indicatorCopy.summaries = [];
        for (let i = 0; i < yearRange[1] - yearRange[0]; i += 1) {
          const year = yearRange[0] + i;
          const recordsForYear = recordsPerYear.get(year);
          const summary = {
            year,
            indicatorSummary: d3[indicator.summaryType](recordsForYear, d => d[key]),
          };
          indicatorCopy.summaries.push(summary);
        }
        indicatorSummaries.push(indicatorCopy);
      });
    }

    const data = new Map();

    data.set('msa', msa);
    data.set('ntd', ntd);
    data.set('ta', ta);
    data.set('statesTopo', rawStates);
    data.set('allNationalMapData', allNationalMapData);
    data.set('yearRange', yearRange);
    data.set('changeColorScale', changeColorScale);
    data.set('indicators', indicators);
    data.set('indicatorSummaries', indicatorSummaries);
    console.log('data', data);
    return data;
  },
  getAllNationalMapData({
    msa,
    ntd,
    ta,
  }) {
    return msa.map((metro) => {
      const metroCopy = Object.assign({}, metro);
      metroCopy.ta = ta.filter(agency => agency.msaId === metro.msaId)
        .map((agency) => {
          const agencyCopy = Object.assign({}, agency);
          agencyCopy.cent = metro.cent;
          agencyCopy.ntd = ntd
            .filter(d => d.taId === agency.taId)
            .map((d) => {
              const ntdCopy = Object.assign({}, d);
              ntdCopy.msaId = agency.msaId;
              ntdCopy.cent = metro.cent;
              return ntdCopy;
            });
          return agencyCopy;
        });
      return metroCopy;
    });
  },
  getData(callback) {
    const { cleanData } = dataMethods;
    Promise.all([
      d3.json('https://ridership.carto.com/api/v2/sql?q=SELECT+DISTINCT+ON+(taid)+*+FROM+ta'),
      d3.json('https://ridership.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20msa'),
      d3.json('https://ridership.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20ntd'),
      d3.json('data/states.json'),
    ])
      .then((rawData) => {
        const data = cleanData({ rawData });
        callback(data);
      });
  },
};

export default dataMethods;
