import pandas as pd
from numpy import inf
from numpy import nan
from acs import msa_population
from eia import gas_prices
from meta import clean_ta
from maintenance import load_maintenance
from carto import replace_data

# Load the excel data:
TA = pd.read_excel('data/meta/Transit_Agencies_for_Visualization.xlsx',
                   sheet_name='TC AgencyList')
NTD22_RAW = pd.read_excel('data/ntd/TS2.2TimeSeriesSysWideOpexpSvc_2.xlsx',
                          sheet_name=['UPT', 'VRM', 'VRH',
                                      'DRM', 'VOMS', 'PMT'])
NTD21_RAW = pd.read_excel('data/ntd/TS2.1TimeSeriesOpExpSvcModeTOS_3.xlsx',
                          sheet_name=['UPT', 'FARES', 'OpExp Total'])

print 'Data successfully loaded from Excel'

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

TA_DROP = ['ShowIndividual', '"Other" primary Project ID', 'Primary UZA',
           'UZA Name', 'Agency Name', 'Reporter Acronym', 'display']
ta_clean = clean_ta(TA, TA_DROP)

datasets = {}

for i in ntd21:
    datasets[i] = ntd21[i].drop(columns=col21)

for i in ntd22:
    datasets[i] = ntd22[i].drop(columns=col22)

print 'Loaded and cleaned data for: ' + str(datasets.keys())

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

# Calculate derived values
# Average fares
stacks['avg_fare'] = pd.Series(stacks['fares'] / stacks['upt'], name='avg_fare')

# Average speed
stacks['speed'] = pd.Series(stacks['vrm'] / stacks['vrh'], name='speed')

# Farebox recovery
stacks['recovery'] = pd.Series(stacks['fares'] / stacks['opexp_total'], name='recovery')

# Vehicle revenue miles per ride
stacks['vrm_per_ride'] = pd.Series(stacks['vrm'] / stacks['upt'], name='vrm_per_ride')

# Average headways
stacks['headways'] = pd.Series(
    ((stacks['drm'] / stacks['speed']) / stacks['voms']) * 60, name='headways'
)

# Average trip length
stacks['trip_length'] = pd.Series(stacks['pmt'] / stacks['upt'], name='trip_length')

# Miles between failures
stacks['failures'] = pd.Series(stacks['pmt'] / load_maintenance(), name='failures')

# Ridership per capita
stacks['capita'] = pd.Series(stacks['upt'] / msa_population(), name='capita')

# Gas prices
stacks['gas'] = pd.Series(gas_prices(), name='gas')

# Delete extra indicators
del stacks['vrh']
del stacks['drm']
del stacks['voms']
del stacks['pmt']

print 'Calculated values for ' + str(stacks.keys())

# Removing zeroes and Infinities
indexes = ['id', 'year']
export = pd.concat(stacks.values(), axis=1).replace([inf, 0], nan)

#Export to CSV
export.to_csv('data/output/ntd.csv', index_label=indexes)

indexes.extend(export.columns.values)

# Upload to Carto
replace_data('ntd', indexes, 'ntd.csv')
