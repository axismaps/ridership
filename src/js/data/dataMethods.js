const dataMethods = {

  cleanData({ rawData }) {
    const [rawMsa, rawNtd, rawTa, rawStates] = rawData;
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

    const ntd = parseFloatFields({
      records: rawNtd,
      fields: [
        'Total OE',
        'UPT',
        'VRM',
        'bus',
        'fares',
        'headways',
        'rail',
        'recovery',
        'speed',
        'trip_length',
        'vrm_per_ride',
        'year',
      ],
    });

    const data = new Map();

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
      d3.csv('data/ntd.csv'),
      d3.csv('data/ta.csv'),
      d3.json('data/states.json'),
    ])
      .then((rawData) => {
        const data = cleanData({ rawData });
        callback(data);
      });
  },
};

export default dataMethods;
