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
    m = df[[ind, val]].rename(index=str, columns={ind: 'index', val: 'value'})
    group = m.groupby('index').sum().stack()
    print group

    return group


def load_excel():
    maintenance = {}
    files = os.listdir(DIR)
    for i in files:
        print i
        year = re.search(r"^\d{4}", i).group(0)
        maintenance[year] = format_data(pd.read_excel(DIR + i))
    return maintenance


def main():
    years = load_excel()


if __name__ == "__main__":
    main()
