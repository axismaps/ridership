"""Load and parse maintenance data for miles between failures measure"""
import os
import re
import pandas as pd
from meta import clean_ta

DIR = 'data/ntd/maintenance/'
# Various TA ID's used by the different files
VALID_ID_KEYS = [
    'Trs_Id',
    '5 Digit NTD ID',
    'NTDID',
    'NTD ID',
    '5 Digit NTDID'
]

# Different value column names in each file
VALID_VAL_KEYS = [
    'Major Failures',
    'Major_Failure_Num',
    'mechanical_failures',
    'Major mechanical system failures',
    'Mechanical_Failures',
    '  mechanical_failures'
]

def format_data(df):
    """Take maintenance data from excel and return as key / value pairs"""
    # Get indicator column and value column based on matching key list
    ind = list(set(df.keys()).intersection(VALID_ID_KEYS))[0]
    val = list(set(df.keys()).intersection(VALID_VAL_KEYS))[0]

    # Convert old TRS ID to new NTD ID and create new df as subselection
    if ind == 'Trs_Id':
        df['NTD ID'] = df[ind].apply(
            lambda x: str(x).zfill(4)[:1] + '0' + str(x).zfill(4)[1:]
        ).astype(int)
        m = df[['NTD ID', val]]
    else:
        m = df[[ind, val]].rename(index=str, columns={ind: 'NTD ID'})

    # Convert data to numeric, turning all missing values to 0
    m['maintenance'] = pd.to_numeric(m[val], errors='coerce').fillna(value=0)
    # Group and stack by NTD ID
    group = m[['NTD ID', 'maintenance']].groupby('NTD ID').sum().stack()
    return group

def load_excel(tas):
    """Creates maintenance data by looping through directory and formatting excel data"""
    maintenance = pd.DataFrame()
    files = os.listdir(DIR)
    for i in files:
        year = re.search(r"^\d{4}", i).group(0)
        maintenance[year] = format_data(pd.read_excel(DIR + i))

    # Merge with TA data and stack / sum by project ID
    merge = pd.merge(maintenance, tas, how='inner', on='NTD ID').drop(columns='NTD ID')
    stack = merge.groupby('Project ID').sum().stack()
    return stack

def load_maintenance():
    """Load maintenance data, join to TAs and return for combining with other NTD data"""
    # Load and clean the TAs used in the visualization
    TA = pd.read_excel('data/meta/Transit_Agencies_for_Visualization.xlsx',
                       sheet_name='TC AgencyList')
    TA_DROP = ['ShowIndividual', '"Other" primary Project ID', 'Primary UZA',
               'UZA Name', 'Agency Name', 'Reporter Acronym', 'display']
    ta_clean = clean_ta(TA, TA_DROP)

    # Send TAs to be combined with maintenance data then export to CSV
    years = load_excel(ta_clean)
    years.to_csv('data/output/maintenance.csv')
    return years

if __name__ == "__main__":
    print load_maintenance()
