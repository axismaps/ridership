"""Primary script for loading and parsing NTD data"""

import pandas as pd
from numpy import inf
from numpy import nan
from eia import gas_prices
from meta import clean_ta
from maintenance import load_maintenance
from population import get_population
from carto import replace_data

def filterByMode(dframe, modes):
    """Filters NTD data by a list of modes (bus / rail)"""
    return dframe[dframe['Mode'].isin(modes)]

# Merge the data with TA metadata
def ntd_merge(dframe, d_name):
    """Merges with TA data and creates a grouped / summed stack"""
    # Merge dataframes
    merge = pd.merge(ta_clean, dframe, how='left', on='NTD ID')
    group = merge.drop(columns=['NTD ID']).groupby('Project ID')

    # Sum, stack, and export to CSV
    s_t = group.sum().stack()
    return s_t.rename(d_name)

INFLATION = {
    '2006': 1.25,
    '2007': 1.21,
    '2008': 1.17,
    '2009': 1.17,
    '2010': 1.15,
    '2011': 1.12,
    '2012': 1.09,
    '2013': 1.08,
    '2014': 1.06,
    '2015': 1.06,
    '2016': 1.05,
    '2017': 1.02,
    '2018': 1
}

def update_dollars(s):
    """Update series based on INFLATION figures"""
    for rowname, row in s.iteritems():
        y = rowname[1] if isinstance(rowname, tuple) else rowname
        s[rowname] = row * INFLATION[str(y)]
    return s

if __name__ == "__main__":
    print('All modules loaded')

    # Load the excel data:
    TA = pd.read_excel('data/meta/Transit_Agencies_for_Visualization.xlsx',
                       sheet_name='TC AgencyList')
    NTD22_RAW = pd.read_excel('data/ntd/TS2.2TimeSeriesSysWideOpexpSvc_2.xlsx',
                              sheet_name=['UPT', 'VRM', 'VRH',
                                          'DRM', 'VOMS', 'PMT'])
    NTD21_RAW = pd.read_excel('data/ntd/TS2.1TimeSeriesOpExpSvcModeTOS_2.xlsx',
                              sheet_name=['UPT', 'FARES', 'OpExp Total', 'VRM', 'VRH'])

    print('Data successfully loaded from Excel')

    ntd21 = {}
    ntd22 = {}

    for i in NTD21_RAW:
        ntd21[i] = NTD21_RAW[i].dropna(subset=['NTD ID'])

    for i in NTD22_RAW:
        ntd22[i] = NTD22_RAW[i].dropna(subset=['NTD ID'])

    # Filter bus data by required modes
    BUS_MODES = ['MB', 'RB', 'CB', 'TB']
    ntd21['bus_upt'] = filterByMode(ntd21['UPT'], BUS_MODES)
    ntd21['bus_vrm'] = filterByMode(ntd21['VRM'], BUS_MODES)
    ntd21['bus_vrh'] = filterByMode(ntd21['VRH'], BUS_MODES)
    ntd21['bus_fares'] = filterByMode(ntd21['FARES'], BUS_MODES)
    ntd21['bus_opexp'] = filterByMode(ntd21['OpExp Total'], BUS_MODES)

    RAIL_MODES = ['CC', 'CR', 'HR', 'LR', 'MG', 'SR', 'YR']
    ntd21['rail_upt'] = filterByMode(ntd21['UPT'], RAIL_MODES)
    ntd21['rail_vrm'] = filterByMode(ntd21['VRM'], RAIL_MODES)
    ntd21['rail_vrh'] = filterByMode(ntd21['VRH'], RAIL_MODES)
    ntd21['rail_fares'] = filterByMode(ntd21['FARES'], RAIL_MODES)
    ntd21['rail_opexp'] = filterByMode(ntd21['OpExp Total'], RAIL_MODES)

    PARA_MODES = ['DR']
    ntd21['para_upt'] = filterByMode(ntd21['UPT'], PARA_MODES)

    del ntd21['UPT']

    # Drop unused columns
    col22 = ['Last Report Year', 'Legacy NTD ID', 'Agency Name', 'Agency Status',
             'Reporter Type', 'City', 'State', 'Census Year', 'Primary UZA Name',
             'UZA', 'UZA Area SQ Miles', 'UZA Population', '2018 Status']
    col21 = ['Last Report Year', 'Legacy NTD ID', 'Agency Name', 'Agency Status',
             'Reporter Type', 'City', 'State', 'Census Year', 'UZA Name', 'Mode', 'Service',
             'Mode Status', 'UZA', 'UZA Area SQ Miles', 'UZA Population', '2018 Status']

    TA_DROP = ['ShowIndividual', 'Primary UZA', 'UZA Name', 'Agency Name',
               'Reporter Acronym', 'display']
    ta_clean = clean_ta(TA, TA_DROP)

    # Creating list of combined TAs and removing big ones
    other_ta = ta_clean[pd.notnull(
        ta_clean['"Other" primary Project ID']
    )]['Project ID'].unique().tolist()
    other_ta.remove(1)
    other_ta.remove(21)

    ta_clean = ta_clean.drop(columns=['"Other" primary Project ID'])

    datasets = {}

    for i in ntd21:
        datasets[i] = ntd21[i].drop(columns=col21)

    for i in ntd22:
        datasets[i] = ntd22[i].drop(columns=col22)

    print('Loaded and cleaned data for: ' + str(datasets.keys()))

    stacks = load_maintenance()
    stacks['population'] = get_population()
    stacks['population'] = stacks['population'].rename('population')

    for name, df in datasets.items():
        n = name.replace(' ', '_').lower()
        stack = ntd_merge(df, n)
        years = pd.Series(stack.index.levels[1])
        stacks[n] = stack.drop(years[years.astype(int) <= 2005], level=1)
    print('Created stacks for ' + str(stacks.keys()))

    # Create MSA stacks
    msa_stacks = {}
    national_values = pd.DataFrame(pd.Series(list(range(2006, 2019)), name='year'))
    ta_export = pd.read_csv('data/output/ta.csv', usecols=['taid', 'msaid', 'taname', 'display'])
    ta_msa = ta_export[['taid', 'msaid']].drop_duplicates()
    for i in stacks:
        m = pd.DataFrame(
            stacks[i].copy().reset_index()
        ).merge(
            ta_msa, left_on='Project ID', right_on='taid'
        )[[i, 'level_1', 'msaid']]
        msa_stacks[i] = m.groupby(['msaid', 'level_1']).sum()
        msa_stacks[i].rename_axis(['msaid', None], inplace=True)
        national = m.groupby('level_1').sum().drop(columns=['msaid']).reset_index()
        national['year'] = national['level_1'].astype(int)
        national_values = national_values.merge(national[['year', i]], how='left', on='year')

    national_values.set_index('year', inplace=True)

    # Calculate derived values
    # Average fares
    stacks['avg_fare'] = update_dollars(pd.Series(stacks['fares'] / stacks['upt'], name='avg_fare'))
    national_values['avg_fare'] = update_dollars(national_values['fares'] / national_values['upt'])
    msa_stacks['avg_fare'] = update_dollars(pd.Series(
        msa_stacks['fares']['fares'] / msa_stacks['upt']['upt'], name='avg_fare'
    ))
    stacks['avg_fare'].drop(labels=other_ta, inplace=True)

    stacks['bus_avg_fare'] = update_dollars(
        pd.Series(stacks['bus_fares'] / stacks['bus_upt'], name='bus_avg_fare')
    )
    national_values['bus_avg_fare'] = update_dollars(
        national_values['bus_fares'] / national_values['bus_upt']
    )
    msa_stacks['bus_avg_fare'] = update_dollars(pd.Series(
        msa_stacks['bus_fares']['bus_fares'] / msa_stacks['bus_upt']['bus_upt'], name='bus_avg_fare'
    ))
    stacks['bus_avg_fare'].drop(labels=other_ta, inplace=True)

    stacks['rail_avg_fare'] = update_dollars(
        pd.Series(stacks['rail_fares'] / stacks['rail_upt'], name='rail_avg_fare')
    )
    national_values['rail_avg_fare'] = update_dollars(
        national_values['rail_fares'] / national_values['rail_upt']
    )
    msa_stacks['rail_avg_fare'] = update_dollars(pd.Series(
        msa_stacks['rail_fares']['rail_fares'] / msa_stacks['rail_upt']['rail_upt'],
        name='rail_avg_fare'
    ))
    stacks['rail_avg_fare'].drop(labels=other_ta, inplace=True)

    # Average speed
    stacks['speed'] = pd.Series(stacks['vrm'] / stacks['vrh'], name='speed')
    national_values['speed'] = national_values['vrm'] / national_values['vrh']
    msa_stacks['speed'] = pd.Series(
        msa_stacks['vrm']['vrm'] / msa_stacks['vrh']['vrh'],
        name='speed'
    )
    stacks['speed'].drop(labels=other_ta, inplace=True)

    stacks['bus_speed'] = pd.Series(stacks['bus_vrm'] / stacks['bus_vrh'], name='bus_speed')
    national_values['bus_speed'] = national_values['bus_vrm'] / national_values['bus_vrh']
    msa_stacks['bus_speed'] = pd.Series(
        msa_stacks['bus_vrm']['bus_vrm'] / msa_stacks['bus_vrh']['bus_vrh'],
        name='bus_speed'
    )
    stacks['bus_speed'].drop(labels=other_ta, inplace=True)

    stacks['rail_speed'] = pd.Series(stacks['rail_vrm'] / stacks['rail_vrh'], name='rail_speed')
    national_values['rail_speed'] = national_values['rail_vrm'] / national_values['rail_vrh']
    msa_stacks['rail_speed'] = pd.Series(
        msa_stacks['rail_vrm']['rail_vrm'] / msa_stacks['rail_vrh']['rail_vrh'],
        name='rail_speed'
    )
    stacks['rail_speed'].drop(labels=other_ta, inplace=True)

    # Farebox recovery
    stacks['recovery'] = pd.Series(stacks['fares'] / stacks['opexp_total'], name='recovery')
    national_values['recovery'] = national_values['fares'] / national_values['opexp_total']
    msa_stacks['recovery'] = pd.Series(
        msa_stacks['fares']['fares'] / msa_stacks['opexp_total']['opexp_total'], name='recovery'
    )
    stacks['recovery'].drop(labels=other_ta, inplace=True)

    stacks['bus_recovery'] = pd.Series(
        stacks['bus_fares'] / stacks['bus_opexp'], name='bus_recovery'
    )
    national_values['bus_recovery'] = national_values['bus_fares'] / national_values['bus_opexp']
    msa_stacks['bus_recovery'] = pd.Series(
        msa_stacks['bus_fares']['bus_fares'] / msa_stacks['bus_opexp']['bus_opexp'],
        name='bus_recovery'
    )
    stacks['bus_recovery'].drop(labels=other_ta, inplace=True)

    stacks['rail_recovery'] = pd.Series(
        stacks['rail_fares'] / stacks['rail_opexp'], name='rail_recovery'
    )
    national_values['rail_recovery'] = national_values['rail_fares'] / national_values['rail_opexp']
    msa_stacks['rail_recovery'] = pd.Series(
        msa_stacks['rail_fares']['rail_fares'] / msa_stacks['rail_opexp']['rail_opexp'],
        name='rail_recovery'
    )
    stacks['rail_recovery'].drop(labels=other_ta, inplace=True)

    # Vehicle revenue miles per ride
    stacks['vrm_per_ride'] = pd.Series(stacks['upt'] / stacks['vrm'], name='vrm_per_ride')
    national_values['vrm_per_ride'] = national_values['upt'] / national_values['vrm']
    msa_stacks['vrm_per_ride'] = pd.Series(
        msa_stacks['upt']['upt'] / msa_stacks['vrm']['vrm'], name='vrm_per_ride'
    )
    stacks['vrm_per_ride'].drop(labels=other_ta, inplace=True)

    # Minimum headways
    stacks['bus_vrm_per_ride'] = pd.Series(
        stacks['bus_upt'] / stacks['bus_vrm'], name='bus_vrm_per_ride'
    )
    national_values['bus_vrm_per_ride'] = national_values['bus_upt'] / national_values['bus_vrm']
    msa_stacks['bus_vrm_per_ride'] = pd.Series(
        msa_stacks['bus_upt']['bus_upt'] / msa_stacks['bus_vrm']['bus_vrm'], name='bus_vrm_per_ride'
    )
    stacks['bus_vrm_per_ride'].drop(labels=other_ta, inplace=True)

    # Minimum headways
    stacks['rail_vrm_per_ride'] = pd.Series(
        stacks['rail_upt'] / stacks['rail_vrm'], name='rail_vrm_per_ride'
    )
    national_values['rail_vrm_per_ride'] = national_values['rail_upt'] / national_values['rail_vrm']
    msa_stacks['rail_vrm_per_ride'] = pd.Series(
        msa_stacks['rail_upt']['rail_upt'] / msa_stacks['rail_vrm']['rail_vrm'],
        name='rail_vrm_per_ride'
    )
    stacks['rail_vrm_per_ride'].drop(labels=other_ta, inplace=True)

    # Minimum headways
    stacks['headways'] = pd.Series(
        ((stacks['drm'] / stacks['speed']) / stacks['voms']) * 60, name='headways'
    )
    national_values['headways'] = (
        (national_values['drm'] / national_values['speed']) / national_values['voms']
    ) * 60
    msa_stacks['headways'] = pd.Series(
        ((msa_stacks['drm']['drm'] / msa_stacks['speed']) / msa_stacks['voms']['voms']) * 60,
        name='headways'
    )
    stacks['headways'].drop(labels=other_ta, inplace=True)

    # Average trip length
    stacks['trip_length'] = pd.Series(stacks['pmt'] / stacks['upt'], name='trip_length')
    national_values['trip_length'] = national_values['pmt'] / national_values['upt']
    msa_stacks['trip_length'] = pd.Series(
        msa_stacks['pmt']['pmt'] / msa_stacks['upt']['upt'], name='trip_length'
    )
    stacks['trip_length'].drop(labels=other_ta, inplace=True)

    # Miles between failures
    stacks['failures'] = stacks['service'] / stacks['maintenance']
    national_values['failures'] = national_values['service'] / national_values['maintenance']
    stacks['failures'] = stacks['failures'].rename('failures')
    national_values['failures'] = national_values['failures'].rename('failures')
    msa_stacks['failures'] = pd.Series(
        msa_stacks['service']['service'] / msa_stacks['maintenance']['maintenance'],
        name='failures'
    )

    # Ridership per capita
    stacks['capita'] = pd.Series(stacks['upt'] / stacks['population'], name='capita')
    msa_stacks['capita'] = pd.Series(
        msa_stacks['upt']['upt'] / msa_stacks['population']['population'], name='capita'
    )
    national_values['capita'] = national_values['upt'] / national_values['population']

    # Gas prices
    stacks['gas'] = update_dollars(gas_prices())
    msa_stacks['gas'] = update_dollars(gas_prices(True))
    national_gas = gas_prices(True).reset_index()
    national_gas['year'] = national_gas['Year'].astype(int)
    national_values['gas'] = national_gas[['year', 'gas']].groupby('year').mean()

    # Delete extra indicators
    del stacks['vrh']
    del stacks['drm']
    del stacks['voms']
    del stacks['pmt']
    del stacks['service']
    del stacks['maintenance']
    del stacks['population']
    del msa_stacks['vrh']
    del msa_stacks['drm']
    del msa_stacks['voms']
    del msa_stacks['pmt']
    del msa_stacks['service']
    del msa_stacks['maintenance']
    del msa_stacks['population']
    national_values.drop(
        columns=['vrh', 'drm', 'voms', 'pmt', 'service', 'maintenance', 'population'],
        inplace=True
    )

    print('Calculated values for ' + str(stacks.keys()))

    # Removing zeroes and Infinities
    indexes = ['id', 'year']
    export = pd.concat(stacks.values(), axis=1).replace([inf, 0], nan)
    export_msa = pd.concat(msa_stacks.values(), axis=1).replace([inf, 0], nan)

    #Export to CSV
    export.to_csv('data/output/ntd.csv', index_label=indexes)
    export_msa.to_csv('data/output/ntd_msa.csv', index_label=indexes)
    national_values.to_csv('data/output/ntd_national.csv')

    # Export formatted CSV
    download = export.rename_axis(['taid', 'year']).reset_index().merge(
        ta_export[ta_export['display']], on='taid'
    )
    col_order = ['taname', 'msaid', 'year', 'upt', 'bus_upt', 'rail_upt', 'para_upt', 'vrm',
                 'bus_vrm', 'rail_vrm', 'headways', 'speed', 'bus_speed', 'rail_speed',
                 'opexp_total', 'fares', 'avg_fare', 'bus_avg_fare', 'rail_avg_fare', 'recovery',
                 'bus_recovery', 'rail_recovery', 'failures', 'gas', 'capita', 'vrm_per_ride',
                 'bus_vrm_per_ride', 'rail_vrm_per_ride', 'trip_length']
    col_names = ['taname', 'msaid', 'year', 'upt', 'bus_upt', 'rail_upt', 'para_upt', 'vrm',
                 'bus_vrm', 'rail_vrm', 'minimum_headways', 'avg_speed', 'bus_speed', 'rail_speed',
                 'operating_expenses_total', 'fare_revenue', 'avg_fare', 'bus_avg_fare',
                 'rail_avg_fare', 'farebox_recovery', 'bus_recovery', 'rail_recovery',
                 'miles_between_failures', 'state_gas_price_per_gal', 'trips_per_capita',
                 'upt_per_vrm', 'bus_vrm_per_ride', 'rail_vrm_per_ride', 'avg_trip_length_mi']
    download[col_order].to_csv('data/output/transit_data.csv', header=col_names, index=False)

    print('Data exported to CSV')

    # Upload to Carto
    indexes.extend(export.columns.values)
    replace_data('ntd', indexes, 'ntd.csv')
    replace_data('ntd_msa', indexes, 'ntd_msa.csv')

    national_index = list(national_values)
    national_index.insert(0, 'year')
    replace_data('ntd_national', national_index, 'ntd_national.csv')
