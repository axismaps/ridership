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
      // 5: "headways"
      // 6: "fares"
      // 7: "recovery"
      // 8: "bus"
      // 9: "rail"
      // 10: "total_oe"
      // 11: "vrm_per_ride"
      // 12: "trip_length"
      // 13: "upt"
      // 14: "speed"
      // 15: "vrm"
      // 16: "taId"

    const indicators = new Map();

    {
      const indicatorList = [
        {
          text: 'Average Headways',
          value: 'headways',
        },
        {
          text: 'Average Fares',
          value: 'fares',
        },
        {
          text: 'Farebox Recovery',
          value: 'recovery',
        },
        {
          text: 'Bus Ridership',
          value: 'bus',
        },
        {
          text: 'Rail Ridership',
          value: 'rail',
        },
        {
          text: 'total_oe',
          value: 'total_oe',
        },
        {
          text: 'Vehicle Revenue Miles (per ride)',
          value: 'vrm_per_ride',
        },
        {
          text: 'Average Trip Length',
          value: 'trip_length',
        },
        {
          text: 'upt',
          value: 'upt',
        },
        {
          text: 'Average Speed',
          value: 'speed',
        },
        {
          text: 'Vehicle Revenue Miles (total)',
          value: 'vrm',
        },
      ];

      indicatorList.forEach((indicator) => {
        indicators.set(indicator.value, indicator);
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
