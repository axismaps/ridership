"""Primary script for loading and parsing NTD data"""
#%%
import pandas as pd
from numpy import inf
from numpy import nan
from eia import gas_prices
from meta import clean_ta
from maintenance import load_maintenance
from population import get_population
from carto import replace_data

print 'All modules loaded'

#%%
# Load the excel data:
TA = pd.read_excel('data/meta/Transit_Agencies_for_Visualization.xlsx',
                   sheet_name='TC AgencyList')
NTD22_RAW = pd.read_excel('data/ntd/TS2.2TimeSeriesSysWideOpexpSvc_2.xlsx',
                          sheet_name=['UPT', 'VRM', 'VRH',
                                      'DRM', 'VOMS', 'PMT'])
NTD21_RAW = pd.read_excel('data/ntd/TS2.1TimeSeriesOpExpSvcModeTOS_3.xlsx',
                          sheet_name=['UPT', 'FARES', 'OpExp Total'])

print 'Data successfully loaded from Excel'

#%%
ntd21 = {}
ntd22 = {}

for i in NTD21_RAW:
    ntd21[i] = NTD21_RAW[i].dropna(subset=['NTD ID'])

for i in NTD22_RAW:
    ntd22[i] = NTD22_RAW[i].dropna(subset=['NTD ID'])

def filterByMode(dframe, modes):
    """Filters NTD data by a list of modes (bus / rail)"""
    return dframe[dframe['Mode'].isin(modes)]

# Filter bus data by required modes
BUS_MODES = ['MB', 'RB', 'CB', 'TB']
ntd21['bus'] = filterByMode(ntd21['UPT'], BUS_MODES)

RAIL_MODES = ['CC', 'CR', 'HR', 'LR', 'MG', 'SR', 'YR']
ntd21['rail'] = filterByMode(ntd21['UPT'], RAIL_MODES)

del ntd21['UPT']

# Drop unused columns
col22 = ['Last Report Year', 'Legacy NTD ID', 'Agency Name', 'Agency Status',
         'Reporter Type', 'City', 'State', 'Census Year', 'Primary UZA Name',
         'UZA', 'UZA Area SQ Miles', 'UZA Population', '2017 Status']
col21 = ['Last Report Year', 'Legacy NTD ID', 'Agency Name', 'Agency Status',
         'Reporter Type', 'City', 'State', 'Census Year', 'UZA Name', 'Mode', 'Service',
         'Mode Status', 'UZA', 'UZA Area SQ Miles', 'UZA Population', '2017 Status']

TA_DROP = ['ShowIndividual', 'Primary UZA', 'UZA Name', 'Agency Name',
           'Reporter Acronym', 'display']
ta_clean = clean_ta(TA, TA_DROP)
other_ta = ta_clean[pd.notnull(
    ta_clean['"Other" primary Project ID']
)]['Project ID'].unique().tolist()
ta_clean = ta_clean.drop(columns=['"Other" primary Project ID'])

datasets = {}

for i in ntd21:
    datasets[i] = ntd21[i].drop(columns=col21)

for i in ntd22:
    datasets[i] = ntd22[i].drop(columns=col22)

print 'Loaded and cleaned data for: ' + str(datasets.keys())

#%%
# Merge the data with TA metadata
def ntd_merge(dframe, d_name):
    """Merges with TA data and creates a grouped / summed stack"""
    # Merge dataframes
    merge = pd.merge(ta_clean, dframe, how='left', on='NTD ID')
    group = merge.drop(columns=['NTD ID']).groupby('Project ID')

    # Sum, stack, and export to CSV
    s_t = group.sum().stack()
    return s_t.rename(d_name)

stacks = load_maintenance()
stacks['population'] = get_population()
stacks['population'] = stacks['population'].rename('population')

for name, df in datasets.items():
    n = name.replace(' ', '_').lower()
    stack = ntd_merge(df, n)
    years = pd.Series(stack.index.levels[1])
    stacks[n] = stack.drop(years[years.astype(int) <= 2005], level=1)

print'Created stacks for ' + str(stacks.keys())

#%%
# Create MSA stacks
msa_stacks = {}
national_values = pd.DataFrame(pd.Series(list(range(2006, 2018)), name='year'))
ta_export = pd.read_csv('data/output/ta.csv', usecols=['taid', 'msaid', 'taname'])
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
    print national_values

national_values.set_index('year', inplace=True)

#%%
# Calculate derived values
# Average fares
stacks['avg_fare'] = pd.Series(stacks['fares'] / stacks['upt'], name='avg_fare')
national_values['avg_fare'] = national_values['fares'] / national_values['upt']
msa_stacks['avg_fare'] = pd.Series(
    msa_stacks['fares']['fares'] / msa_stacks['upt']['upt'], name='avg_fare'
)
stacks['avg_fare'].drop(labels=other_ta, inplace=True)

# Average speed
stacks['speed'] = pd.Series(stacks['vrm'] / stacks['vrh'], name='speed')
national_values['speed'] = national_values['vrm'] / national_values['vrh']
msa_stacks['speed'] = pd.Series(msa_stacks['vrm']['vrm'] / msa_stacks['vrh']['vrh'], name='speed')
stacks['speed'].drop(labels=other_ta, inplace=True)

# Farebox recovery
stacks['recovery'] = pd.Series(stacks['fares'] / stacks['opexp_total'], name='recovery')
national_values['recovery'] = national_values['fares'] / national_values['opexp_total']
msa_stacks['recovery'] = pd.Series(
    msa_stacks['fares']['fares'] / msa_stacks['opexp_total']['opexp_total'], name='recovery'
)
stacks['recovery'].drop(labels=other_ta, inplace=True)

# Vehicle revenue miles per ride
stacks['vrm_per_ride'] = pd.Series(stacks['upt'] / stacks['vrm'], name='vrm_per_ride')
national_values['vrm_per_ride'] = national_values['upt'] / national_values['vrm']
msa_stacks['vrm_per_ride'] = pd.Series(
    msa_stacks['upt']['upt'] / msa_stacks['vrm']['vrm'], name='vrm_per_ride'
)
stacks['vrm_per_ride'].drop(labels=other_ta, inplace=True)

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

#%%

# Ridership per capita
stacks['capita'] = pd.Series(stacks['upt'] / stacks['population'], name='capita')
msa_stacks['capita'] = pd.Series(
    msa_stacks['upt']['upt'] / msa_stacks['population']['population'], name='capita'
)
national_values['capita'] = national_values['upt'] / national_values['population']

# Gas prices
stacks['gas'] = gas_prices()
msa_stacks['gas'] = gas_prices(True)
national_gas = gas_prices(True).reset_index()
national_gas['year'] = national_gas['Year'].astype(int)
national_values['gas'] = national_gas[['year', 'gas']].groupby('year').mean()

#%%
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

print 'Calculated values for ' + str(stacks.keys())

#%%
# Removing zeroes and Infinities
indexes = ['id', 'year']
export = pd.concat(stacks.values(), axis=1).replace([inf, 0], nan)
export_msa = pd.concat(msa_stacks.values(), axis=1).replace([inf, 0], nan)

#Export to CSV
export.to_csv('data/output/ntd.csv', index_label=indexes)
export_msa.to_csv('data/output/ntd_msa.csv', index_label=indexes)
national_values.to_csv('data/output/ntd_national.csv')

# Export formatted CSV
export.rename_axis(['taid', 'year']).reset_index().merge(
    ta_export, on='taid'
).to_csv('data/output/transit_data.csv')

print 'Data exported to CSV'

#%%
# Upload to Carto
indexes.extend(export.columns.values)
replace_data('ntd', indexes, 'ntd.csv')
replace_data('ntd_msa', indexes, 'ntd_msa.csv')

national_index = list(national_values)
national_index.insert(0, 'year')
replace_data('ntd_national', national_index, 'ntd_national.csv')
