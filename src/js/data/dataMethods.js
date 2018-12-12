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
      // getIndicatorSummaries,
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
        {
          text: 'Miles Between Failures',
          value: 'failures',
          summaryType: 'mean',
        },
      ];

      indicatorList.forEach((indicator) => {
        indicators.set(indicator.value, indicator);
      });
    }

    const censusFields = [
      {
        text: 'Total Population',
        value: 'pop',
      },
      {
        text: 'Population Density',
        value: 'density',
        upload: true,
      },
      {
        text: 'Percent Foreign Born',
        value: 'foreign_pct',
      },
      {
        text: 'Percent White',
        value: 'white_pct',
      },
      {
        text: 'Percent Black',
        value: 'black_pct',
      },
      {
        text: 'Percent Asian',
        value: 'asian_pct',
      },
      {
        text: 'Percent Hispanic/Latino',
        value: 'latino_pct',
      },
      {
        text: 'Population Age 75+',
        value: 'over75',
      },
      {
        text: 'Median Household Income',
        value: 'income',
      },
      {
        text: 'Percent Households with No Vehicle',
        value: 'no_vehicle_pct',
      },
      {
        text: 'Percent Commute by Driving',
        value: 'drive_pct',
      },
      {
        text: 'Percent Commute by Carpooling',
        value: 'carpool_pct',
      },
      {
        text: 'Percent Commute by Public Transit',
        value: 'transit_pct',
      },
    ];

    const distanceFilters = [
      {
        text: '0.25 miles',
        value: 0.25,
      },
      {
        text: '0.5 miles',
        value: 0.5,
      },
      {
        text: '1.0 miles',
        value: 1,
      },

    ];

    const data = new Map();

    data.set('msa', msa);
    data.set('ntd', ntd);
    data.set('ta', ta);
    data.set('statesTopo', rawStates);
    data.set('allNationalMapData', allNationalMapData);
    data.set('yearRange', yearRange);
    data.set('changeColorScale', changeColorScale);
    data.set('indicators', indicators);
    data.set('cachedTractGeoJSON', new Map());
    data.set('cachedTractData', new Map());
    data.set('censusFields', censusFields);
    data.set('distanceFilters', distanceFilters);
    console.log('data', data);

    return data;
  },
  getAllNationalMapData({
    msa,
    ntd,
    ta,
  }) {
    let globalId = 1;
    return msa.map((metro) => {
      const metroCopy = Object.assign({}, metro);
      metroCopy.globalId = globalId;
      globalId += 1;
      metroCopy.ta = ta.filter(agency => agency.msaId === metro.msaId)
        .map((agency) => {
          const agencyCopy = Object.assign({}, agency);
          agencyCopy.globalId = globalId;
          globalId += 1;
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
      d3.json('https://ridership.carto.com/api/v2/sql?q=SELECT%20%2A%20FROM%20ta%20WHERE%20display%20%3D%20true'),
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
