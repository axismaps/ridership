import dropdownItems from './dataDropdownItems';

const dataMethods = {
  cleanData({ rawData }) {
    const [
      rawTa,
      rawMsa,
      rawNtd,
      rawStates,
      rawMsaNtd,
      rawNationalNtd,
      rawInvisibleTa,
    ] = rawData;

    const {
      indicators,
      censusFields,
      distanceFilters,
    } = dropdownItems;

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

    const cleanTa = (record) => {
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
    };

    const invisibleTa = rawInvisibleTa.rows.map(record => cleanTa(record));

    const ta = rawTa.rows.map((record) => {
      const cleanRecord = cleanTa(record);
      cleanRecord.subTa = invisibleTa.filter(d => d.taId === cleanRecord.taId);
      return cleanRecord;
    });

    const ntd = rawNtd.rows.map((record) => {
      const cleanRecord = Object.assign({}, record);
      cleanRecord.taId = record.id.toString();
      return cleanRecord;
    });


    const msaNtd = rawMsaNtd.rows.map((record) => {
      const cleanRecord = Object.assign({}, record);
      cleanRecord.msaId = record.id.toString();
      return cleanRecord;
    });

    const nationalNtd = rawNationalNtd.rows;

    const allNationalMapData = getAllNationalMapData({
      msa,
      ntd,
      ta,
      msaNtd,
    });
    const radiusScale = getRadiusScale({ ntd });
    const mobileRadiusScale = getRadiusScale({ ntd }).range([2, 20]);


    const yearRange = d3.extent(ntd, d => d.year);
    const msaYearRange = [2010, 2016];

    const changeColorScale = d3.scaleThreshold()
      .domain([-25, -5, 5, 25])
      .range([
        '#BC4E9F',
        '#E6B4D6',
        '#E2F1FD',
        '#8BD5D5',
        '#009093',
      ]);


    const nationalScaleExtent = [1, 8];
    // const nationalScaleExtentMobile = [0.5, 8];

    const params = new URLSearchParams(window.location.search);

    const defaultYears = [2008, 2015];

    const data = new Map();

    data.set('radiusScale', radiusScale);
    data.set('mobileRadiusScale', mobileRadiusScale);
    data.set('msa', msa);
    data.set('ntd', ntd);
    data.set('ta', ta);
    data.set('msaNtd', msaNtd);
    data.set('nationalNtd', nationalNtd);
    data.set('statesTopo', rawStates);
    data.set('allNationalMapData', allNationalMapData);
    data.set('yearRange', yearRange);
    data.set('msaYearRange', msaYearRange);
    data.set('changeColorScale', changeColorScale);
    data.set('indicators', indicators);
    data.set('cachedTractGeoJSON', new Map());
    data.set('cachedTractData', new Map());
    data.set('censusFields', censusFields);
    data.set('distanceFilters', distanceFilters);
    data.set('nationalScaleExtent', nationalScaleExtent);
    data.set('params', params);
    data.set('defaultYears', defaultYears);

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
      d3.json('https://ridership.carto.com/api/v2/sql?q=SELECT%20%2A%20FROM%20ta%20WHERE%20display%20%3D%20false'),
    ])
      .then((rawData) => {
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
