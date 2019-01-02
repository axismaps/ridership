"""Primary script for loading and parsing NTD data"""
#%%
import pandas as pd
from numpy import inf
from numpy import nan
from bin.acs import msa_population
from bin.eia import gas_prices
from bin.meta import clean_ta
from bin.maintenance import load_maintenance
from bin.carto import replace_data

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
    # Merge dataframes
    merge = pd.merge(ta_clean, dframe, how='left', on='NTD ID')
    group = merge.drop(columns=['NTD ID']).groupby('Project ID')

    # Sum, stack, and export to CSV
    s_t = group.sum().stack()
    return s_t.rename(d_name)

stacks = {}

for name, df in datasets.items():
    n = name.replace(' ', '_').lower()
    stack = ntd_merge(df, n)
    years = pd.Series(stack.index.levels[1])
    stacks[n] = stack.drop(years[years.astype(int) <= 2005], level=1)

print'Created stacks for ' + str(stacks.keys())

#%%
# Create MSA stacks
msa_stacks = {}
ta_msa = pd.read_csv('data/output/ta.csv', usecols=['taid', 'msaid']).drop_duplicates()
for i in stacks:
    m = pd.DataFrame(
        stacks[i].copy().reset_index()
    ).merge(
        ta_msa, left_on='Project ID', right_on='taid'
    )[[i, 'level_1', 'msaid']]
    print m
    msa_stacks[i] = m.groupby(['msaid', 'level_1']).sum()

print msa_stacks

#%%
# Calculate derived values
# Average fares
stacks['avg_fare'] = pd.Series(stacks['fares'] / stacks['upt'], name='avg_fare')
msa_stacks['avg_fare'] = msa_stacks['fares'] / msa_stacks['upt']
stacks['avg_fare'].drop(labels=other_ta, inplace=True)

# Average speed
stacks['speed'] = pd.Series(stacks['vrm'] / stacks['vrh'], name='speed')
msa_stacks['speed'] = msa_stacks['vrm'] / msa_stacks['vrh']
stacks['speed'].drop(labels=other_ta, inplace=True)

# Farebox recovery
stacks['recovery'] = pd.Series(stacks['fares'] / stacks['opexp_total'], name='recovery')
msa_stacks['recovery'] = msa_stacks['fares'] / msa_stacks['opexp_total']
stacks['recovery'].drop(labels=other_ta, inplace=True)

# Vehicle revenue miles per ride
stacks['vrm_per_ride'] = pd.Series(stacks['vrm'] / stacks['upt'], name='vrm_per_ride')
msa_stacks['vrm_per_ride'] = msa_stacks['vrm'] / msa_stacks['upt']
stacks['vrm_per_ride'].drop(labels=other_ta, inplace=True)

# Minimum headways
stacks['headways'] = pd.Series(
    ((stacks['drm'] / stacks['speed']) / stacks['voms']) * 60, name='headways'
)
msa_stacks['headways'] = ((msa_stacks['drm'] / msa_stacks['speed']) / msa_stacks['voms']) * 60
stacks['headways'].drop(labels=other_ta, inplace=True)

# Average trip length
stacks['trip_length'] = pd.Series(stacks['pmt'] / stacks['upt'], name='trip_length')
msa_stacks['trip_length'] = msa_stacks['pmt'] / msa_stacks['upt']
stacks['trip_length'].drop(labels=other_ta, inplace=True)

# Miles between failures
stacks['failures'] = pd.Series(stacks['pmt'] / load_maintenance(), name='failures')
stacks['failures'].drop(labels=other_ta, inplace=True)

# Ridership per capita
stacks['capita'] = pd.Series(stacks['upt'] / msa_population(), name='capita')

# Gas prices
stacks['gas'] = gas_prices()

# Delete extra indicators
del stacks['vrh']
del stacks['drm']
del stacks['voms']
del stacks['pmt']
del msa_stacks['vrh']
del msa_stacks['drm']
del msa_stacks['voms']
del msa_stacks['pmt']

print 'Calculated values for ' + str(stacks.keys())

#%%
# Removing zeroes and Infinities
indexes = ['id', 'year']
export = pd.concat(stacks.values(), axis=1).replace([inf, 0], nan)
export_msa = pd.concat(msa_stacks.values(), axis=1).replace([inf, 0], nan)
print msa_stacks.values()
print export_msa

#Export to CSV
export.to_csv('data/output/ntd.csv', index_label=indexes)
export_msa.to_csv('data/output/ntd_msa.csv', index_label=indexes)

print 'Data exported to CSV'

#%%
# Upload to Carto
indexes.extend(export.columns.values)
replace_data('ntd', indexes, 'ntd.csv')
