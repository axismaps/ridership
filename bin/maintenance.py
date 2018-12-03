import os
import re
import pandas as pd
from meta import clean_ta

DIR = 'data/ntd/maintenance/'
VALID_ID_KEYS = [
    'Trs_Id',
    '5 Digit NTD ID',
    'NTDID',
    'NTD ID',
    '5 Digit NTDID'
]

VALID_VAL_KEYS = [
    'Major Failures',
    'Major_Failure_Num',
    'mechanical_failures',
    'Major mechanical system failures',
    'Mechanical_Failures',
    '  mechanical_failures'
]

def format_data(df):
    ind = list(set(df.keys()).intersection(VALID_ID_KEYS))[0]
    val = list(set(df.keys()).intersection(VALID_VAL_KEYS))[0]
    m = df[[ind, val]].rename(index=str, columns={ind: 'NTD ID'})
    m['maintenance'] = pd.to_numeric(m[val], errors='coerce').fillna(value=0)
    group = m[['NTD ID', 'maintenance']].groupby('NTD ID').sum().stack()
    return group

def load_excel(tas):
    maintenance = pd.DataFrame()
    files = os.listdir(DIR)
    for i in files:
        year = re.search(r"^\d{4}", i).group(0)
        maintenance[year] = format_data(pd.read_excel(DIR + i))
    
    merge = pd.merge(maintenance, tas, how='inner', on='NTD ID').drop(columns='NTD ID')
    stack = merge.groupby('Project ID').sum().stack()
    return stack

def load_maintenance():
    TA = pd.read_excel('data/meta/Transit_Agencies_for_Visualization.xlsx',
                       sheet_name='TC AgencyList')
    TA_DROP = ['ShowIndividual', '"Other" primary Project ID', 'Primary UZA',
               'UZA Name', 'Agency Name', 'Reporter Acronym', 'display']
    ta_clean = clean_ta(TA, TA_DROP)

    years = load_excel(ta_clean)
    return years

if __name__ == "__main__":
    print load_maintenance()
