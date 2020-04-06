import pandas as pd
from meta import make_match_state

def gas_prices(msa_level=False):
    pr = pd.read_csv('data/eia/pr_all.csv')
    ta3 = pd.read_csv('data/eia/MER_TA3.csv')

    prices = pr[pr['MSN'] == 'MGACD'].drop(
        columns=[str(x) for x in range(1970, 2006)]
    )
    con = ta3[ta3['MSN'] == 'PAACKUS']
    con['YYYY'] = con['YYYYMM'].apply(lambda x: str(x)[:-2])
    con = con[['YYYY', 'Value']].set_index('YYYY')

    msa = pd.read_csv('data/output/msa.csv')
    msa['State'] = msa['name'].apply(make_match_state)
    merge1 = pd.merge(msa, prices, how='left', on='State')

    ta_raw = pd.read_csv('data/output/ta.csv')
    ta = ta_raw[ta_raw['display']]

    id_drop = 'Project ID' if msa_level else 'msaid'
    id_keep = 'msaid' if msa_level else 'Project ID'

    merge2 = pd.merge(
        ta, merge1, how='left', on='msaid'
    ).rename(
        index=str, columns={'taid': 'Project ID'}
    ).drop(
        columns=[id_drop, 'display', 'centx', 'centy', 'minx', 'miny', 'maxx', 'maxy',
                 'talong', 'tashort', 'msa_color', 'name', 'State', 'Data_Status', 'MSN'
                ]
    ).drop_duplicates(subset=[id_keep])

    print(merge2.columns)

    stack = pd.DataFrame(
        merge2.groupby(id_keep).sum().stack()
    ).reset_index()
    stack.rename(index=str, columns={'level_1':'Year', 0: 'price'}, inplace=True)
    combined = stack.merge(con, how='left', left_on='Year', right_on='YYYY')
    combined['gas'] = combined['price'].astype(float) * combined['Value'].astype(float) / 42
    df = pd.DataFrame(
        combined[[id_keep, 'Year', 'gas']]
    ).set_index([id_keep, 'Year'])
    return df['gas']

if __name__ == "__main__":
    print(gas_prices())
