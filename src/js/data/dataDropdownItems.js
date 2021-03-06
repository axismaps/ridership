const indicators = new Map();

{
  const indicatorList = [
    {
      text: 'Transit Ridership',
      value: 'upt',
      id: 'upt',
      summaryType: 'sum',
      format: ',d',
      meta: 'Total unlinked passenger trips (UPTs) taken, on any public transit mode. Legs of a trip with transfers are counted as individual trips.',
      verified: true,
      parent: 'Ridership',
      mode: 'All',
    },
    {
      text: 'Bus Ridership',
      value: 'bus_upt',
      id: 'bus_upt',
      summaryType: 'sum',
      format: ',d',
      meta: 'Unlinked passenger trips on any bus mode, which include local, rapid, commuter, and trolley bus.',
      verified: true,
      parent: 'Ridership',
      mode: 'Bus',
    },
    {
      text: 'Rail Ridership',
      value: 'rail_upt',
      id: 'rail_upt',
      summaryType: 'sum',
      format: ',d',
      parent: 'Ridership',
      mode: 'Rail',
      verified: true,
    },
    {
      text: 'Paratransit Ridership',
      value: 'para_upt',
      id: 'para_upt',
      summaryType: 'sum',
      format: ',d',
      meta: 'Unlinked passenger trips on any rail mode, which include light, heavy, commuter, hybrid, and streetcar rail; monorail; &amp; cable car.',
      verified: true,
      parent: 'Ridership',
      mode: 'Paratransit',
    },
    {
      text: 'Vehicle Revenue Miles',
      value: 'vrm',
      id: 'vrm',
      summaryType: 'sum',
      format: ',d',
      unit: ' mi',
      meta: 'Total miles that vehicles of any mode travel in revenue service (or, serving customers). VRM is a measure of service provision.',
      verified: true,
      parent: 'Vehicle Revenue Miles',
      mode: 'All',
    },
    {
      text: 'Bus Vehicle Revenue Miles',
      value: 'bus_vrm',
      id: 'bus_vrm',
      summaryType: 'sum',
      format: ',d',
      unit: ' mi',
      parent: 'Vehicle Revenue Miles',
      mode: 'Bus',
      verified: true,
    },
    {
      text: 'Rail Vehicle Revenue Miles',
      value: 'rail_vrm',
      id: 'rail_vrm',
      summaryType: 'sum',
      format: ',d',
      unit: ' mi',
      parent: 'Vehicle Revenue Miles',
      mode: 'Rail',
      verified: true,
    },
    {
      text: 'Minimum Headway',
      value: 'headways',
      id: 'headways',
      summaryType: 'mean',
      format: '.1f',
      unit: ' min',
      meta: 'Minimum average time (in minutes) between scheduled transit trips for all modes. It is a derived, approximate measure of service frequency. It is a function of directional route miles, vehicles in operation, and speed.<br><br>Averages include all trips, whose frequencies vary widely according to time of day, day of week, mode. Calculated averages will not represent the frequency that most riders experience during transit rides, but they are  useful for modal or cross-agency comparisons.',
    },
    {
      text: 'Average Vehicle Speed',
      value: 'speed',
      id: 'speed',
      summaryType: 'mean',
      format: '.1f',
      unit: ' mph',
      meta: 'Total vehicle revenue miles divided by total vehicle revenue hours, for all modes. It relates to transit’s time competitiveness with other modes.<br><br>Averages include all rides, whose speeds  may vary widely according to time of day or mode. Calculated averages are most useful for modal or cross-agency comparisons.',
      parent: 'Average Vehicle Speed',
      mode: 'All',
    },
    {
      text: 'Bus Average Vehicle Speed',
      value: 'bus_speed',
      id: 'bus_speed',
      summaryType: 'mean',
      format: '.1f',
      unit: ' mph',
      parent: 'Average Vehicle Speed',
      mode: 'Bus',
    },
    {
      text: 'Rail Average Vehicle Speed',
      value: 'rail_speed',
      id: 'rail_speed',
      summaryType: 'mean',
      format: '.1f',
      unit: ' mph',
      parent: 'Average Vehicle Speed',
      mode: 'Rail',
    },
    {
      text: 'Operating Expenses',
      value: 'opexp_total',
      id: 'opexp_total',
      summaryType: 'sum',
      format: '$,d',
      meta: 'Total transit agency expenses for operating service, for all modes (e.g. daily expenses of running & maintaining vehicles and facilities). Operating expenses are a measure of service provision.',
      verified: true,
      parent: 'Operating Expenses',
      mode: 'All',
    },
    {
      text: 'Bus Operating Expenses',
      value: 'bus_opexp',
      id: 'bus_opexp',
      summaryType: 'sum',
      format: '$,d',
      parent: 'Operating Expenses',
      mode: 'Bus',
      verified: true,
    },
    {
      text: 'Rail Operating Expenses',
      value: 'rail_opexp',
      id: 'rail_opexp',
      summaryType: 'sum',
      format: '$,d',
      parent: 'Operating Expenses',
      mode: 'Rail',
      verified: true,
    },
    {
      text: 'Average Fare',
      value: 'avg_fare',
      id: 'avg_fare',
      summaryType: 'mean',
      format: '$.2f',
      meta: 'Total revenue from collected fares divided by total trips (UPTs). Fares are a measure of transit’s cost competitiveness with other modes and how accessible it is to riders with low incomes.<br><br>Averages include all rides, whose fares vary according to time of day, zones, and programs to which a rider belongs. Calculated averages will not represent the fare that most riders pay for a single ride, but they are useful for making modal or cross-agency comparisons or examing trends.',
      parent: 'Average Fare',
      mode: 'All',
      maxRadius: 20,
    },
    {
      text: 'Bus Average Fare',
      value: 'bus_avg_fare',
      id: 'bus_avg_fare',
      summaryType: 'mean',
      format: '$.2f',
      parent: 'Average Fare',
      mode: 'Bus',
      maxRadius: 20,
    },
    {
      text: 'Rail Average Fare',
      value: 'rail_avg_fare',
      id: 'rail_avg_fare',
      summaryType: 'mean',
      format: '$.2f',
      parent: 'Average Fare',
      mode: 'Rail',
      maxRadius: 20,
    },
    {
      text: 'Farebox Recovery',
      value: 'recovery',
      id: 'recovery',
      summaryType: 'mean',
      format: '.1%',
      meta: 'Share of operating expenses covered by fares. It measures how much an agency depends on riders to fund operations.',
      verified: true,
      parent: 'Farebox Recovery',
      mode: 'All',
    },
    {
      text: 'Bus Farebox Recovery',
      value: 'bus_recovery',
      id: 'bus_recovery',
      summaryType: 'mean',
      format: '.1%',
      parent: 'Farebox Recovery',
      mode: 'Bus',
      verified: true,
    },
    {
      text: 'Rail Farebox Recovery',
      value: 'rail_recovery',
      id: 'rail_recovery',
      summaryType: 'mean',
      format: '.1%',
      parent: 'Farebox Recovery',
      mode: 'Rail',
      verified: true,
    },
    {
      text: 'Miles Between Failures',
      value: 'failures',
      id: 'failures',
      summaryType: 'mean',
      format: ',d',
      unit: ' mi',
      meta: 'Average miles vehicles of any mode travel between major mechanical failures. It relates to service reliability and vehicles state-of-good-repair.',
      maxRadius: 20,
    },
    {
      text: 'Trips Per Person',
      value: 'capita',
      id: 'capita',
      summaryType: 'mean',
      format: '.1f',
      meta: 'Transit ridership divided by service area population. It standardizes transit ridership by region size. Service area definitions and population data sources used change from year to year, so changes over time may be inaccurate.',
    },
    {
      text: 'Riders per Vehicle Revenue Mile',
      value: 'vrm_per_ride',
      id: 'vrm_per_ride',
      summaryType: 'mean',
      format: '.1f',
      unit: ' rides per mi',
      meta: 'Unlinked passenger trips divided by VRM. It standardizes ridership by service provision & suggests the efficiency of service provision.',
      verified: true,
      parent: 'Riders per Vehicle Revenue Mile',
      mode: 'All',
    },
    {
      text: 'Bus Riders per Vehicle Revenue Mile',
      value: 'bus_vrm_per_ride',
      id: 'bus_vrm_per_ride',
      summaryType: 'mean',
      format: '.1f',
      unit: ' rides per mi',
      parent: 'Riders per Vehicle Revenue Mile',
      mode: 'Bus',
      verified: true,
    },
    {
      text: 'Rail Riders per Vehicle Revenue Mile',
      value: 'rail_vrm_per_ride',
      id: 'rail_vrm_per_ride',
      summaryType: 'mean',
      format: '.1f',
      unit: ' rides per mi',
      parent: 'Riders per Vehicle Revenue Mile',
      mode: 'Rail',
      verified: true,
    },
    {
      text: 'Average Trip Length',
      value: 'trip_length',
      id: 'trip_length',
      summaryType: 'mean',
      format: '.1f',
      unit: ' mi',
      meta: 'Total miles traveled by passengers on all modes divided by unlinked passenger trips. It describes how riders use transit. It is a function of passenger miles traveled and unlinked passenger trips.<br><br>Averages include all trips, whose lengths vary widely according to mode.',
    },
    {
      text: 'Statewide Gas Price',
      value: 'gas',
      id: 'gas',
      summaryType: 'mean',
      format: '$.2f',
      unit: ' per gallon',
      meta: 'Average annual cost per gallon of gas, in dollars per gallon, at the state-wide level. It measures driving’s cost competitiveness.',
      fixedRadius: false,
      maxRadius: 10,
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
    meta: 'Total population living in area.',
    verified: true,
  },
  {
    text: 'Population Density',
    value: 'density',
    id: 'density',
    upload: true,
    format: ',d',
    unit: ' per sq mi',
    meta: 'Population per square mile',
    verified: true,
  },
  {
    text: 'Percent Foreign Born',
    value: 'foreign_pct',
    id: 'foreign_pct',
    format: '.0%',
    unit: '%',
    meta: 'Share of population born outside the U.S., including naturalized citizens and non-citizens of the U.S.<br><br>In census tracts with small foreign-born populations, margin of error may be high.',
    verified: true,
  },
  {
    text: 'Percent White',
    value: 'white_pct',
    id: 'white_pct',
    format: '.0%',
    unit: '%',
    meta: 'Share of population identifying as white or caucasian.',
    verified: true,
  },
  {
    text: 'Percent Black',
    value: 'black_pct',
    id: 'black_pct',
    format: '.0%',
    unit: '%',
    meta: 'Share of population identifying as black or African American.',
    verified: true,
  },
  {
    text: 'Percent Asian',
    value: 'asian_pct',
    id: 'asian_pct',
    format: '.0%',
    unit: '%',
    meta: 'Share of population identifying as Asian or Asian American.',
    verified: true,
  },
  {
    text: 'Percent Hispanic/Latino',
    value: 'latino_pct',
    id: 'latino_pct',
    format: '.0%',
    unit: '%',
    meta: 'Share of population identifying as Hispanic or Latino.',
    verified: true,
  },
  {
    text: 'Percent Population Age 75+',
    value: 'over75_pct',
    id: 'over75_pct',
    format: '.0%',
    unit: '%',
    meta: 'Share of population aged 75 years or older.',
    verified: true,
  },
  {
    text: 'Median Household Income',
    value: 'income',
    id: 'income',
    format: '$,d',
    meta: 'Median income of households, adjusted to 2018 dollars.',
    verified: true,
  },
  {
    text: 'Average monthly housing rent',
    value: 'rent',
    id: 'rent',
    format: '$,d',
    meta: 'Average monthly housing rent.',
    verified: true,
  },
  {
    text: 'Percent Households with No Vehicle',
    value: 'no_vehicle_pct',
    id: 'no_vehicle_pct',
    format: '.0%',
    unit: '%',
    meta: 'Share of households that do not own a vehicle.',
    verified: true,
  },
  {
    text: 'Percent Commute by Driving',
    value: 'drive_pct',
    id: 'drive_pct',
    format: '.0%',
    unit: '%',
    meta: 'Share of workers ages 16 or older who commute to work in a single-occupancy vehicle.',
    verified: true,
  },
  {
    text: 'Percent Commute by Public Transit',
    value: 'transit_pct',
    id: 'transit_pct',
    format: '.0%',
    unit: '%',
    meta: 'Share of workers ages 16 or older who commute to work on public transit.<br><br>In census tracts with small populations of public transit commuters, margin of error may be high.',
  },
  {
    text: 'Job Density',
    value: 'job_density',
    id: 'job_density',
    format: ',d',
    unit: ' per sq mi',
    meta: 'Total jobs per square mile.<br><br>Data reported do not include federal government jobs.',
  },
  {
    text: 'Job and Population Density',
    value: 'job_pop_density',
    id: 'job_pop_density',
    format: ',d',
    unit: ' per sq mi',
    meta: 'Total jobs and residential population per square mile.<br><br>Data reported do not include federal government jobs.',
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
