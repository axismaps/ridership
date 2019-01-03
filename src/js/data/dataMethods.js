const dataMethods = {
  cleanData({ rawData }) {
    const [
      rawTa,
      rawMsa,
      rawNtd,
      rawStates,
      rawMsaNtd,
      rawNationalNtd,
    ] = rawData;

    const {
      getAllNationalMapData,
      getRadiusScale,
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
    console.log('msa', msa);

    const ta = rawTa.rows.map((record) => {
      const {
        msaid,
        taid,
        taname,
        tashort,
        /* eslint-disable camelcase */
        msa_color,
        /* eslint-enable camelcase */
      } = record;

      return {
        msaId: msaid.toString(),
        taId: taid.toString(),
        taName: taname,
        taShort: tashort,
        color: msa_color,
      };
    });
    console.log('ta', ta);

    const ntd = rawNtd.rows.map((record) => {
      const cleanRecord = Object.assign({}, record);
      cleanRecord.taId = record.id.toString();
      return cleanRecord;
    });

    console.log('ntd', ntd);

    const msaNtd = rawMsaNtd.rows.map((record) => {
      const cleanRecord = Object.assign({}, record);
      cleanRecord.msaId = record.id.toString();
      return cleanRecord;
    });

    const nationalNtd = rawNationalNtd.rows;

    console.log('msaNtd', msaNtd);
    const allNationalMapData = getAllNationalMapData({
      msa,
      ntd,
      ta,
      msaNtd,
    });

    const radiusScale = getRadiusScale({ ntd });

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
          text: 'Transit Ridership',
          value: 'upt',
          summaryType: 'sum',
          format: ',d',
        },
        {
          text: 'Bus Ridership',
          value: 'bus',
          summaryType: 'sum',
          format: ',d',
        },
        {
          text: 'Rail Ridership',
          value: 'rail',
          summaryType: 'sum',
          format: ',d',
        },
        {
          text: 'Vehicle Revenue Miles',
          value: 'vrm',
          summaryType: 'sum',
          format: ',.1f',
          unit: ' mi',
        },
        {
          text: 'Minimum Headways',
          value: 'headways',
          summaryType: 'mean',
          format: '.1f',
          unit: ' min',
        },
        {
          text: 'Average Vehicle Speed',
          value: 'speed',
          summaryType: 'mean',
          format: '.1f',
          unit: ' mph',
        },
        {
          text: 'Operating Expenses',
          value: 'opexp_total',
          summaryType: 'sum',
          format: '$,d',
        },
        {
          text: 'Average Fare',
          value: 'avg_fare',
          summaryType: 'mean',
          format: '$.2f',
        },
        {
          text: 'Farebox Recovery',
          value: 'recovery',
          summaryType: 'mean',
          format: '.1%',
        },
        {
          text: 'Miles Between Failures',
          value: 'failures',
          summaryType: 'mean',
          format: ',d',
          unit: ' mi',
        },
        {
          text: 'Statewide Gas Prices',
          value: 'gas',
          summaryType: 'mean',
          format: '$.2f',
          unit: ' per gallon',
        },
        {
          text: 'Trips Per Person',
          value: 'capita',
          summaryType: 'mean',
          format: '.1f',
        },
        {
          text: 'Vehicle Revenue Miles per trip',
          value: 'vrm_per_ride',
          summaryType: 'mean',
          format: '.2f',
          unit: ' mi per trip',
        },
        {
          text: 'Average Trip Length',
          value: 'trip_length',
          summaryType: 'mean',
          format: '.2f',
          unit: ' mi',
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
        text: 'Percent Population Age 75+',
        value: 'over75_pct',
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
      {
        text: 'Job Density',
        value: 'job_density',
      },
      {
        text: 'Job and Population Density',
        value: 'job_pop_density',
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

    const scaleExtent = {
      national: [1, 8],
      msa: [6, 18],
    };

    const data = new Map();


    data.set('radiusScale', radiusScale);
    data.set('msa', msa);
    data.set('ntd', ntd);
    data.set('ta', ta);
    data.set('msaNtd', msaNtd);
    data.set('nationalNtd', nationalNtd);
    data.set('statesTopo', rawStates);
    data.set('allNationalMapData', allNationalMapData);
    data.set('yearRange', yearRange);
    data.set('changeColorScale', changeColorScale);
    data.set('indicators', indicators);
    data.set('cachedTractGeoJSON', new Map());
    data.set('cachedTractData', new Map());
    data.set('censusFields', censusFields);
    data.set('distanceFilters', distanceFilters);
    data.set('scaleExtent', scaleExtent);
    console.log('data', data);

    return data;
  },
  getAllNationalMapData({
    msa,
    ntd,
    msaNtd,
    ta,
  }) {
    let globalId = 1;
    return msa.map((metro) => {
      const metroCopy = Object.assign({}, metro);
      metroCopy.globalId = globalId;
      metroCopy.ntd = msaNtd
        .filter(d => d.msaId === metro.msaId)
        .map((d) => {
          const ntdCopy = Object.assign({}, d);
          ntdCopy.cent = metro.cent;
          return ntdCopy;
        });
      globalId += 1;
      const agencies = ta.filter(agency => agency.msaId === metro.msaId)
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

      metroCopy.ta = agencies;
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
      d3.json('https://ridership.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20ntd_msa'),
      d3.json('https://ridership.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20ntd_national'),
    ])
      .then((rawData) => {
        console.log('rawData', rawData);
        const data = cleanData({ rawData });
        callback(data);
      });
  },
  getRadiusScale({
    ntd,
  }) {
    const ntd2017 = ntd
      .filter(d => d.year === 2017);

    const domain = d3.extent(ntd2017, d => d.upt);

    return d3.scaleSqrt()
      .domain(domain)
      .range([5, 35]);
  },
};

export default dataMethods;
