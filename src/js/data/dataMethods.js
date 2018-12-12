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

    const ta = rawTa.rows.map((record, i) => {
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

    // {
    //   /**
    //    * Add colors to all agencies
    //    * @private
    //    */
    //   const largestAgencyColor = '#644497';
    //   const colors = [
    //     '#00ad91',
    //     '#ff5e4d',
    //     '#eb52d6',
    //     '#ff9d2e',
    //     '#8c6112',
    //     '#0f8fff',
    //     '#33a02c',
    //     '#c2ab00',
    //     '#707070',
    //     '#bc80bd',
    //   ];
    //   msa.forEach((metro) => {
    //     const agencies = ta.filter(d => d.msaId === metro.msaId);
    //     console.log('agencies', agencies);
    //     const averageUPTs = agencies.reduce((accumulator, d) => {
    //       accumulator[d.taId] = d3.mean(d.ntd, dd => dd.upt);
    //       return accumulator;
    //     }, {});
    //     const largestAgency = agencies.reduce((accumulator, d) => {
    //       if (averageUPTs[d.taId] > averageUPTs[accumulator.taId]) {
    //         return d;
    //       }
    //       return accumulator;
    //     })
    //       .taId;
    //     let agenciesAssigned = 0;
    //     agencies.forEach((agency) => {
    //       if (agency.taId === largestAgency) {
    //         /* eslint-disable no-param-reassign */
    //         agency.color = largestAgencyColor;
    //       } else {
    //         agency.color = colors[agenciesAssigned];
    //         /* eslint-enable no-param-reassign */
    //         agenciesAssigned += 1;
    //       }
    //     });
    //   });
    // }
    // console.log('ta', ta);

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
          format: '.2r',
        },
        {
          text: 'Average Fares',
          value: 'fares',
          summaryType: 'mean',
          format: '$.2f',
        },
        {
          text: 'Farebox Recovery',
          value: 'recovery',
          summaryType: 'sum',
          format: ',.2p',
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
          text: 'Operating Expenses (total)',
          value: 'total_oe',
          summaryType: 'sum',
          format: '$,d',
        },
        {
          text: 'Vehicle Revenue Miles (per ride)',
          value: 'vrm_per_ride',
          summaryType: 'mean',
          format: '.2f',
        },
        {
          text: 'Average Trip Length',
          value: 'trip_length',
          summaryType: 'mean',
          format: '.2f',
        },
        {
          text: 'Unlinked Passenger Trips',
          value: 'upt',
          summaryType: 'sum',
          format: ',d',
        },
        {
          text: 'Average Speed',
          value: 'speed',
          summaryType: 'mean',
          format: '.2f',
        },
        {
          text: 'Vehicle Revenue Miles (total)',
          value: 'vrm',
          summaryType: 'sum',
          format: ',d',
        },
        {
          text: 'Miles Between Failures',
          value: 'failures',
          summaryType: 'mean',
          format: ',d',
        },
        {
          text: 'Ridership per Capita',
          value: 'capita',
          summaryType: 'mean',
          format: '.2f',
        },
        {
          text: 'Statewide Gas Prices',
          value: 'gas',
          summaryType: 'mean',
          format: '$.2f',
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
    const largestAgencyColor = '#644497';
    const colors = [
      '#00ad91',
      '#ff5e4d',
      '#eb52d6',
      '#ff9d2e',
      '#8c6112',
      '#0f8fff',
      '#33a02c',
      '#c2ab00',
      '#707070',
      '#bc80bd',
    ];
    let globalId = 1;
    return msa.map((metro) => {
      const metroCopy = Object.assign({}, metro);
      metroCopy.globalId = globalId;
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
      const averageUPTs = agencies.reduce((accumulator, d) => {
        accumulator[d.taId] = d3.mean(d.ntd, dd => dd.upt);
        return accumulator;
      }, {});
      const largestAgency = agencies.reduce((accumulator, d) => {
        if (averageUPTs[d.taId] > averageUPTs[accumulator.taId]) {
          return d;
        }
        return accumulator;
      })
        .taId;
      let agenciesAssigned = 0;
      agencies.forEach((agency) => {
        if (agency.taId === largestAgency) {
          /* eslint-disable no-param-reassign */
          agency.color = largestAgencyColor;
        } else {
          agency.color = colors[agenciesAssigned];
          /* eslint-enable no-param-reassign */
          agenciesAssigned += 1;
        }
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
    ])
      .then((rawData) => {
        const data = cleanData({ rawData });
        callback(data);
      });
  },
};

export default dataMethods;
