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
      format: ',d',
      unit: ' mi',
    },
    {
      text: 'Minimum Headway',
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
      text: 'Trips Per Person',
      value: 'capita',
      summaryType: 'mean',
      format: '.1f',
    },
    {
      text: 'Riders per Vehicle Revenue Mile',
      value: 'vrm_per_ride',
      summaryType: 'mean',
      format: '.1f',
      unit: ' mi per trip',
    },
    {
      text: 'Average Trip Length',
      value: 'trip_length',
      summaryType: 'mean',
      format: '.1f',
      unit: ' mi',
    },
    {
      text: 'Statewide Gas Price',
      value: 'gas',
      summaryType: 'mean',
      format: '$.2f',
      unit: ' per gallon',
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
    format: ',d',
  },
  {
    text: 'Population Density',
    value: 'density',
    upload: true,
    format: ',d',
  },
  {
    text: 'Percent Foreign Born',
    value: 'foreign_pct',
    format: '.1f',
    unit: '%',
  },
  {
    text: 'Percent White',
    value: 'white_pct',
    format: '.1f',
    unit: '%',
  },
  {
    text: 'Percent Black',
    value: 'black_pct',
    format: '.1f',
    unit: '%',
  },
  {
    text: 'Percent Asian',
    value: 'asian_pct',
    format: '.1f',
    unit: '%',
  },
  {
    text: 'Percent Hispanic/Latino',
    value: 'latino_pct',
    format: '.1f',
    unit: '%',
  },
  {
    text: 'Percent Population Age 75+',
    value: 'over75_pct',
    format: '.1f',
    unit: '%',
  },
  {
    text: 'Median Household Income',
    value: 'income',
    format: '$,d',
  },
  {
    text: 'Percent Households with No Vehicle',
    value: 'no_vehicle_pct',
    format: '.1f',
    unit: '%',
  },
  {
    text: 'Percent Commute by Driving',
    value: 'drive_pct',
    format: '.1f',
    unit: '%',
  },
  {
    text: 'Percent Commute by Carpooling',
    value: 'carpool_pct',
    format: '.1f',
    unit: '%',
  },
  {
    text: 'Percent Commute by Public Transit',
    value: 'transit_pct',
    format: '.1f',
    unit: '%',
  },
  {
    text: 'Job Density',
    value: 'job_density',
    format: ',d',
    unit: 'per sq mi',
  },
  {
    text: 'Job and Population Density',
    value: 'job_pop_density',
    format: ',d',
    unit: 'per sq mi',
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

export default {
  indicators,
  censusFields,
  distanceFilters,
};
