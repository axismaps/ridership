import re
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
    frames = []
    c = Census(settings.CENSUS_API)
    geo = pd.read_csv('data/geojson/tracts/cbsa_crosswalk.csv', dtype={'GEOID': object})
    counties = geo.drop_duplicates(
        ['STATEFP', 'COUNTYFP', 'msaid']
    ).sort_values(['STATEFP', 'COUNTYFP'])

    for i, row in counties.iterrows():
        result = pd.DataFrame(
            c.acs5.state_county_tract('B05002_013E', row['STATEFP'],
                                      row['COUNTYFP'], Census.ALL, year=2010)
        )
        result['GEOID'] = pd.Series(
            result['state'] + result['county'] + result['tract']
        ).astype(str)
        merge = pd.merge(result, geo, on='GEOID').set_index('GEOID')
        frames.append(merge)
        print 'Loaded:', row['STATEFP'], row['COUNTYFP'], i

    print pd.concat(frames)

if __name__ == "__main__":
    # print msa_population()
    print download_census()
