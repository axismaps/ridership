import os.path
import re
import json
import grequests
import pandas as pd
from carto import replace_data
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
    ta = ta_raw[ta_raw['display']].filter(
        items=['taid', 'msaid']
    ).rename(index=str, columns={'taid': 'Project ID'})

    merge = pd.merge(
        pop, ta, how='right', left_on='CBSA', right_on='msaid'
    ).drop(columns=['msaid', 'CBSA'])

    group = merge.groupby('Project ID')

    return group.sum().stack()

def process_result(i, y, var, indexes, frames):
    result = pd.DataFrame(i.json())
    result.columns = result.iloc[0]
    result = result.reindex(result.index.drop(0))
    result['GEOID'] = pd.Series(
        result['state'] + result['county'] + result['tract']
    ).astype(str)
    result['year'] = y
    out = result.set_index(indexes)
    df = out.groupby(level=out.index.names).last()
    frames.append(df[var])
    return frames

def download_census():
    geo = pd.read_csv('data/geojson/tracts/cbsa_crosswalk.csv', dtype={'GEOID': object})
    counties = geo.drop_duplicates(
        ['STATEFP', 'COUNTYFP', 'msaid']
    )
    counties = counties.groupby('STATEFP')[['STATEFP', 'COUNTYFP', 'msaid']].apply(
        lambda x: x.set_index('COUNTYFP').to_dict(orient='index')
    ).to_dict()

    indexes = ['GEOID', 'year']

    with open('data/census/acs.json', "r") as read_file:
        meta = json.load(read_file)
        acs = []
        for r in meta:
            if 'var' in r:
                filename = 'data/output/census/' + r['key'] + '.csv'
                if os.path.isfile(filename):
                    csv = pd.read_csv(
                        filename, dtype={'GEOID': object}
                    ).set_index(indexes)
                    df = csv.groupby(level=csv.index.names).last()
                    acs.append(df)

                else:
                    frames = []
                    errors = []
                    for y in range(2010, 2017):
                        for s in counties:
                            urls = errors
                            errors = []
                            for c in counties[s]:
                                urls.append('https://api.census.gov/data/' + str(y) + \
                                '/acs/acs5?get=' + r['var'] + '&for=tract:*&in=state:' + \
                                str(s).zfill(2) + '%20county:' + str(c).zfill(3) + '&key=' + \
                                settings.CENSUS_API)

                            rs = (grequests.get(u) for u in urls)
                            res = grequests.map(rs)

                            for i in res:
                                try:
                                    frames = process_result(i, y, r['var'], indexes, frames)
                                except:
                                    try:
                                        print i.text
                                        errors.append(i.url)
                                    except:
                                        pass

                            print 'Loaded:', r['name'], y, s
                            print '-----'
                            if errors:
                                print 'Retrying', len(errors), 'errors'

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
        ).set_index(indexes)

        indexes.append('msaid')

        for d in meta:
            print d['name']
            if 'upload' in d and d['upload']:
                indexes.append(d['key'])
            if 'var' not in d:
                if 'sum' in d:
                    combined[d['key']] = 0
                    for s in d['sum']:
                        combined[d['key']] = combined[d['key']] + combined[s]
                else:
                    combined[d['key']] = combined[d['numerator']].divide(
                                            combined[d['denominator']],
                                            fill_value=0
                                        )
                                        
                    if 'scale' in d:
                        combined[d['key']] = combined[d['key']] * d['scale']

        export = combined.reset_index()
        export[indexes].to_csv('data/output/census.csv', index=False)
        replace_data('census', indexes, 'census.csv')

if __name__ == "__main__":
    download_census()
