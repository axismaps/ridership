const dataMethods = {

  cleanData({ rawData }) {
    const [
      rawTa,
      rawMsa,
      rawNtd,
      rawStates,
    ] = rawData;


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
      cleanRecord.id = record.id.toString();
      return cleanRecord;
    });

    const data = new Map();

    data.set('msa', msa);
    data.set('ntd', ntd);
    data.set('ta', ta);
    data.set('statesTopo', rawStates);

    console.log('data', data);

    return data;
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

    d3.json('https://ridership.carto.com/api/v2/sql?q=SELECT%20DISTINCT%20ON%20(id)%20id,%20ST_AsGeoJSON(the_geom)%20as%20the_geom,%20taname,%20tashort,%20msaid,%20msaname%20FROM%20ta_transit_vars')
      .then((data) => {
        console.log('??', data);
      });
  },
};

export default dataMethods;
