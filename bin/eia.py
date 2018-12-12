import pandas as pd
from meta import make_match_state

def gas_prices():
    pr = pd.read_csv('data/ntd/pr_all.csv')
    prices = pr[pr['MSN'] == 'MGACD'].drop(
      columns=[str(x) for x in range(1970, 2006)]
    )

    msa = pd.read_csv('data/output/msa.csv')
    msa['State'] = msa['name'].apply(make_match_state)
    merge1 = pd.merge(msa, prices, how='left', on='State')

    ta_raw = pd.read_csv('data/output/ta.csv')
    ta = ta_raw[ta_raw['display']]
    merge2 = pd.merge(
      ta, merge1, how='left', on='msaid'
    ).rename(
      index=str, columns={'taid': 'Project ID'}
    ).drop(
      columns=['msaid', 'display', 'centx', 'centy', 'minx', 'miny', 'maxx', 'maxy']
    )

    group = merge2.groupby('Project ID')

    return group.sum().stack()

if __name__ == "__main__":
    print gas_prices()