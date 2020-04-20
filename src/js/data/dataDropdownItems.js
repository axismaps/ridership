const indicators = new Map();

{
  const indicatorList = [
    {
      text: 'Transit Ridership',
      value: 'upt',
      id: 'upt',
      summaryType: 'sum',
      format: ',d',
    },
    {
      text: 'Bus Ridership',
      value: 'bus_upt',
      id: 'bus_upt',
      summaryType: 'sum',
      format: ',d',
    },
    {
      text: 'Rail Ridership',
      value: 'rail_upt',
      id: 'rail_upt',
      summaryType: 'sum',
      format: ',d',
    },
    {
      text: 'Paratransit Ridership',
      value: 'para_upt',
      id: 'para_upt',
      summaryType: 'sum',
      format: ',d',
    },
    {
      text: 'Vehicle Revenue Miles',
      value: 'vrm',
      id: 'vrm',
      summaryType: 'sum',
      format: ',d',
      unit: ' mi',
    },
    {
      text: 'Bus Vehicle Revenue Miles',
      value: 'bus_vrm',
      id: 'bus_vrm',
      summaryType: 'sum',
      format: ',d',
      unit: ' mi',
    },
    {
      text: 'Rail Vehicle Revenue Miles',
      value: 'rail_vrm',
      id: 'rail_vrm',
      summaryType: 'sum',
      format: ',d',
      unit: ' mi',
    },
    {
      text: 'Minimum Headway',
      value: 'headways',
      id: 'headways',
      summaryType: 'mean',
      format: '.1f',
      unit: ' min',
    },
    {
      text: 'Average Vehicle Speed',
      value: 'speed',
      id: 'speed',
      summaryType: 'mean',
      format: '.1f',
      unit: ' mph',
    },
    {
      text: 'Bus Average Vehicle Speed',
      value: 'bus_speed',
      id: 'bus_speed',
      summaryType: 'mean',
      format: '.1f',
      unit: ' mph',
    },
    {
      text: 'Rail Average Vehicle Speed',
      value: 'rail_speed',
      id: 'rail_speed',
      summaryType: 'mean',
      format: '.1f',
      unit: ' mph',
    },
    {
      text: 'Operating Expenses',
      value: 'opexp_total',
      id: 'opexp_total',
      summaryType: 'sum',
      format: '$,d',
    },
    {
      text: 'Bus Operating Expenses',
      value: 'bus_opexp',
      id: 'bus_opexp',
      summaryType: 'sum',
      format: '$,d',
    },
    {
      text: 'Rail Operating Expenses',
      value: 'rail_opexp',
      id: 'rail_opexp',
      summaryType: 'sum',
      format: '$,d',
    },
    {
      text: 'Average Fare',
      value: 'avg_fare',
      id: 'avg_fare',
      summaryType: 'mean',
      format: '$.2f',
    },
    {
      text: 'Bus Average Fare',
      value: 'bus_avg_fare',
      id: 'bus_avg_fare',
      summaryType: 'mean',
      format: '$.2f',
    },
    {
      text: 'Rail Average Fare',
      value: 'rail_avg_fare',
      id: 'rail_avg_fare',
      summaryType: 'mean',
      format: '$.2f',
    },
    {
      text: 'Farebox Recovery',
      value: 'recovery',
      id: 'recovery',
      summaryType: 'mean',
      format: '.1%',
    },
    {
      text: 'Bus Farebox Recovery',
      value: 'bus_recovery',
      id: 'bus_recovery',
      summaryType: 'mean',
      format: '.1%',
    },
    {
      text: 'Rail Farebox Recovery',
      value: 'rail_recovery',
      id: 'rail_recovery',
      summaryType: 'mean',
      format: '.1%',
    },
    {
      text: 'Miles Between Failures',
      value: 'failures',
      id: 'failures',
      summaryType: 'mean',
      format: ',d',
      unit: ' mi',
    },
    {
      text: 'Trips Per Person',
      value: 'capita',
      id: 'capita',
      summaryType: 'mean',
      format: '.1f',
    },
    {
      text: 'Riders per Vehicle Revenue Mile',
      value: 'vrm_per_ride',
      id: 'vrm_per_ride',
      summaryType: 'mean',
      format: '.1f',
      unit: ' rides per mi',
    },
    {
      text: 'Bus Riders per Vehicle Revenue Mile',
      value: 'bus_vrm_per_ride',
      id: 'bus_vrm_per_ride',
      summaryType: 'mean',
      format: '.1f',
      unit: ' rides per mi',
    },
    {
      text: 'Rail Riders per Vehicle Revenue Mile',
      value: 'rail_vrm_per_ride',
      id: 'rail_vrm_per_ride',
      summaryType: 'mean',
      format: '.1f',
      unit: ' rides per mi',
    },
    {
      text: 'Average Trip Length',
      value: 'trip_length',
      id: 'trip_length',
      summaryType: 'mean',
      format: '.1f',
      unit: ' mi',
    },
    {
      text: 'Statewide Gas Price',
      value: 'gas',
      id: 'gas',
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
    id: 'pop',
    format: ',d',
  },
  {
    text: 'Population Density',
    value: 'density',
    id: 'density',
    upload: true,
    format: ',d',
    unit: ' per sq mi',
  },
  {
    text: 'Percent Foreign Born',
    value: 'foreign_pct',
    id: 'foreign_pct',
    format: '.0%',
    unit: '%',
  },
  {
    text: 'Percent White',
    value: 'white_pct',
    id: 'white_pct',
    format: '.0%',
    unit: '%',
  },
  {
    text: 'Percent Black',
    value: 'black_pct',
    id: 'black_pct',
    format: '.0%',
    unit: '%',
  },
  {
    text: 'Percent Asian',
    value: 'asian_pct',
    id: 'asian_pct',
    format: '.0%',
    unit: '%',
  },
  {
    text: 'Percent Hispanic/Latino',
    value: 'latino_pct',
    id: 'latino_pct',
    format: '.0%',
    unit: '%',
  },
  {
    text: 'Percent Population Age 75+',
    value: 'over75_pct',
    id: 'over75_pct',
    format: '.0%',
    unit: '%',
  },
  {
    text: 'Median Household Income',
    value: 'income',
    id: 'income',
    format: '$,d',
  },
  {
    text: 'Percent Households with No Vehicle',
    value: 'no_vehicle_pct',
    id: 'no_vehicle_pct',
    format: '.0%',
    unit: '%',
  },
  {
    text: 'Percent Commute by Driving',
    value: 'drive_pct',
    id: 'drive_pct',
    format: '.0%',
    unit: '%',
  },
  {
    text: 'Percent Commute by Carpooling',
    value: 'carpool_pct',
    id: 'carpool_pct',
    format: '.0%',
    unit: '%',
  },
  {
    text: 'Percent Commute by Public Transit',
    value: 'transit_pct',
    id: 'transit_pct',
    format: '.0%',
    unit: '%',
  },
  {
    text: 'Job Density',
    value: 'job_density',
    id: 'job_density',
    format: ',d',
    unit: ' per sq mi',
  },
  {
    text: 'Job and Population Density',
    value: 'job_pop_density',
    id: 'job_pop_density',
    format: ',d',
    unit: ' per sq mi',
  },
];

const censusDropdownItems = censusFields.reduce((items, currentField) => (
  items.concat([currentField, {
    ...currentField,
    text: `Change in ${currentField.text}`,
    id: `${currentField.id}_change`,
    change: true,
  }])
), []);

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
  censusDropdownItems,
};
