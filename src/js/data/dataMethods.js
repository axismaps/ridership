const dataMethods = {

  cleanData({ rawData }) {
    const [
      rawMsa,
      rawNtd,
      rawTa,
      rawStates,
    ] = rawData;

    console.log('rawNtd', rawNtd);
    const parseFloatFields = ({ fields, records }) => records.map((record) => {
      const cleanRecord = Object.assign({}, record);
      fields.forEach((field) => {
        cleanRecord[field] = parseFloat(record[field], 10);
      });
      return cleanRecord;
    });

    const msa = parseFloatFields({
      records: rawMsa,
      fields: [
        'centx',
        'centy',
        'maxx',
        'maxy',
        'minx',
        'miny',
      ],
    });

    // const ntd = parseFloatFields({
    //   records: rawNtd,
    //   fields: [
    //     'Total OE',
    //     'UPT',
    //     'VRM',
    //     'bus',
    //     'fares',
    //     'headways',
    //     'rail',
    //     'recovery',
    //     'speed',
    //     'trip_length',
    //     'vrm_per_ride',
    //     'year',
    //   ],
    // });

    const ntd = rawNtd.rows.map((record) => {
      const cleanRecord = Object.assign({}, record);
      cleanRecord.id = record.id.toString();
      return cleanRecord;
    });

    const data = new Map();

    console.log('msa', msa);

    console.log('ntd', ntd);
    console.log('ta', rawTa);

    data.set('msa', msa);
    data.set('ntd', ntd);
    data.set('ta', rawTa);
    data.set('statesTopo', rawStates);

    return data;
  },
  getData(callback) {
    const { cleanData } = dataMethods;
    Promise.all([
      d3.csv('data/msa.csv'),
      // d3.csv('data/ntd.csv'),
      d3.json('https://ridership.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20ntd'),
      d3.csv('data/ta.csv'),
      d3.json('data/states.json'),
    ])
      .then((rawData) => {
        const data = cleanData({ rawData });
        callback(data);
      });

    // d3.json('https://ridership.carto.com/api/v2/sql?q=SELECT%20DISTINCT%20ON%20(id)%20id,%20ST_AsGeoJSON(the_geom)%20as%20the_geom,%20taname,%20tashort,%20msaid,%20msaname%20FROM%20ta_transit_vars')
    //   .then((data) => {
    //     console.log('??', data);
    //   });
    // d3.json('https://ridership.carto.com/api/v2/sql?q=SELECT%20*%20FROM%20ta_transit_vars')
    //   .then((test) => {
    //     console.log('test?', test);
    //   });
  },
};

export default dataMethods;
