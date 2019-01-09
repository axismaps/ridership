"""Load and parse maintenance data for miles between failures measure"""
import os
import re
import pandas as pd
from meta import clean_ta

DIRS = {
    'maintenance': {
        'dir': 'data/ntd/maintenance/',
        'keys': [
            'Major Failures',
            'Major_Failure_Num',
            'mechanical_failures',
            'Major mechanical system failures',
            'Mechanical_Failures',
            '  mechanical_failures'
        ]
    },
    'service': {
        'dir': 'data/ntd/service/',
        'keys': [
            'Actual Vehicle Miles',
            'Total actual miles',
            'Actual Vehicles/Passenger Car Miles',
            'Actual Vehicles/ Passenger Car Miles',
            'Pass_Car_Miles_Num',
            'Vehicle_Or_Train_Miles',
            'vehicle_Or_Train_Miles'
        ]
    }
}

# Various TA ID's used by the different files
VALID_ID_KEYS = [
    'Trs_Id',
    '5 Digit NTD ID',
    'NTDID',
    'NTD ID',
    '5 Digit NTDID'
]

VALID_TIME_KEYS = [
    'Time Period',
    'Time_Period_Desc',
    '  Time_Period_Desc'
]

def format_maintenance_data(df, keys, col, y):
    """Take maintenance data from excel and return as key / value pairs"""
    # Get indicator column and value column based on matching key list
    ind = list(set(df.keys()).intersection(VALID_ID_KEYS))[0]
    val = list(set(df.keys()).intersection(keys))[0]

    if col == 'service':
        time = list(set(df.keys()).intersection(VALID_TIME_KEYS))[0]
        df = df[df[time].str.contains('Annual Total')]

    # Convert old TRS ID to new NTD ID and create new df as subselection
    if ind == 'Trs_Id' or y == '2013':
        df['NTD ID'] = df[ind].apply(
            lambda x: str(x).zfill(4)[:1] + '0' + str(x).zfill(4)[1:]
        ).astype(int)
        m = df[['NTD ID', val]]
    else:
        m = df[[ind, val]].rename(index=str, columns={ind: 'NTD ID'})

    # Convert data to numeric, turning all missing values to 0
    m[col] = pd.to_numeric(m[val], errors='coerce').fillna(value=0)
    m['NTD ID'] = pd.to_numeric(m['NTD ID'], errors='coerce')
    # Group and stack by NTD ID
    group = m[['NTD ID', col]].groupby('NTD ID').sum().stack()
    return group

def load_excel(tas):
    """Creates maintenance data by looping through directory and formatting excel data"""
    failures = {}
    for m, d in DIRS.iteritems():
        df = pd.DataFrame()
        files = os.listdir(d['dir'])
        for i in files:
            y = re.search(r"^\d{4}", i)
            if y:
                year = y.group(0)
                h = 1 if i == '2014 Service.xlsx' or i == '2013 Service_0.xlsx' else 0
                df[year] = format_maintenance_data(
                    pd.read_excel(d['dir'] + i, header=h),
                    d['keys'],
                    m,
                    year
                )
        merge = pd.merge(df, tas, how='inner', on='NTD ID').drop(columns='NTD ID')
        failures[m] = merge.groupby('Project ID').sum().stack()
        failures[m] = failures[m].rename(m)

    return failures

def load_maintenance():
    """Load maintenance data, join to TAs and return for combining with other NTD data"""
    # Load and clean the TAs used in the visualization
    TA = pd.read_excel('data/meta/Transit_Agencies_for_Visualization.xlsx',
                       sheet_name='TC AgencyList')
    TA_DROP = ['ShowIndividual', '"Other" primary Project ID', 'Primary UZA',
               'UZA Name', 'Agency Name', 'Reporter Acronym', 'display']
    ta_clean = clean_ta(TA, TA_DROP)

    # Send TAs to be combined with maintenance data then export to CSV
    return load_excel(ta_clean)

if __name__ == "__main__":
    print load_maintenance()
