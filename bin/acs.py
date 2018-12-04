import os.path
import re
import json
import pandas as pd
from census import Census
import settings

def msa_population():
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
    ta = ta_raw[ta_raw.display is True].filter(items=['taid', 'msaid'])

    merge = pd.merge(pop, ta, how='right', left_on='CBSA', right_on='msaid')

    return merge

def download_census():
    c = Census(settings.CENSUS_API)
    geo = pd.read_csv('data/geojson/tracts/cbsa_crosswalk.csv', dtype={'GEOID': object})
    counties = geo.drop_duplicates(
        ['STATEFP', 'COUNTYFP', 'msaid']
    ).sort_values(['STATEFP', 'COUNTYFP'])

    with open('data/census/acs.json', "r") as read_file:
        meta = json.load(read_file)
        acs = []
        for r in meta:
            if 'var' in r:
                filename = 'data/output/census/' + r['key'] + '.csv'
                if os.path.isfile(filename):
                    csv = pd.read_csv(
                        filename, dtype={'GEOID': object}
                    ).set_index(['GEOID', 'year'])
                    acs.append(csv)

                else:
                    frames = []
                    for y in range(2010, 2016):
                        for i, row in counties.iterrows():
                            res = c.acs5.state_county_tract(r['var'], row['STATEFP'],
                                                            row['COUNTYFP'], Census.ALL, year=y)
                            if res:
                                result = pd.DataFrame(res)
                                result['GEOID'] = pd.Series(
                                    result['state'] + result['county'] + result['tract']
                                ).astype(str)
                                result['year'] = y
                                out = result.set_index(['GEOID', 'year'])
                                frames.append(out[r['var']])
                                print 'Loaded:', r['name'], row['STATEFP'], row['COUNTYFP'], y, i
                            else:
                                print 'Empty:', r['name'], row['STATEFP'], row['COUNTYFP'], y, i

                    ind = pd.Series(pd.concat(frames), name=r['key'])
                    ind.to_csv(filename, header=r['key'])
                    acs.append(ind)

        combined = pd.concat(acs, axis=1).reset_index().merge(
            geo, on='GEOID', how='inner'
        ).drop(
            columns=['STATEFP', 'COUNTYFP', 'TRACTCE',
                     'AFFGEOID', 'NAME', 'AWATER', 'LSAD', 'CBSAFP']
        ).dropna(
            subset=['pop']
        ).set_index(['GEOID', 'year'])

        for d in meta:
            if 'var' not in d:
                if 'sum' in d:
                    combined[d['key']] = 0
                    for s in d['sum']:
                        combined[d['key']] = combined[d['key']] + combined[s]
                else:
                    combined[d['key']] = combined[d['numerator']].astype(int) / \
                                        combined[d['denominator']].astype(int)
                    if 'scale' in d:
                        combined[d['key']] = combined[d['key']] * d['scale']

        combined.to_csv('data/output/census.csv')

if __name__ == "__main__":
    # print msa_population()
    print download_census()
