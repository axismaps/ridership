import re
import pandas as pd

def load_population():
    pop_raw = pd.read_csv('data/census/csa-est2017-alldata.csv')
    pop = pop_raw[
        (pd.isnull(pop_raw['MDIV'])) & (pd.isnull(pop_raw['STCOU']))
    ].dropna(
        subset=['CBSA']
    ).filter(
        regex="^(CBSA|POPESTIMATE)"
    ).rename(
        columns=lambda x: re.sub('^POPESTIMATE', '', x)
    )

    ta_raw = pd.read_csv('data/output/ta.csv')
    ta = ta_raw[ta_raw.display == True].filter(items=['taid', 'msaid'])

    merge = pd.merge(pop, ta, how='right', left_on='CBSA', right_on='msaid')

    return merge

if __name__ == "__main__":
    print load_population()
