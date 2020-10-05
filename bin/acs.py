"""
Download ACS data and parse for uploading
"""

import os.path
import json
import grequests
import pandas as pd
from ntd import update_dollars
from carto import replace_data
import settings

def process_result(i, y, var, indexes, frames):
    """Transform downloaded result to data frame by year"""
    result = pd.DataFrame(i.json())
    result.columns = result.iloc[0]
    result = result.reindex(result.index.drop(0))
    if 'metropolitan statistical area/micropolitan statistical area' in result.columns:
        result.rename(
            columns={'metropolitan statistical area/micropolitan statistical area':'GEOID'},
            inplace=True
        )
    else:
        result['GEOID'] = pd.Series(
            result['state'] + result['county'] + result['tract']
        ).astype(str)
    result['year'] = y
    out = result.set_index(indexes)
    df = out.groupby(level=out.index.names).last()
    data = pd.to_numeric(df[var])
    frames.append(data[data >= 0])
    return frames

def combine_files(frame, geo, cols, index):
    """Merge downloaded ACS data with geo file"""
    return pd.concat(frame, axis=1).reset_index().merge(
        geo, on='GEOID', how='inner'
        ).drop(
            columns=cols
        ).dropna(
            subset=['pop']
        ).set_index(index)

def download_census():
    """Download and parse ACS data as defined in acs.json"""
    geo = pd.read_csv('data/geojson/tracts/cbsa_crosswalk.csv', dtype={'GEOID': object})
    counties = geo.drop_duplicates(
        ['STATEFP', 'COUNTYFP', 'msaid']
    )
    counties = counties.groupby('STATEFP')[['STATEFP', 'COUNTYFP', 'msaid']].apply(
        lambda x: x.set_index('COUNTYFP').to_dict(orient='index')
    ).to_dict()
    msa_geo = pd.read_csv('data/geojson/cbsa/cb_2017_us_cbsa_500k.csv', dtype={'GEOID': object})

    indexes = ['GEOID', 'year']
    msa_indexes = ['GEOID', 'year']

    with open('data/census/acs.json', "r") as read_file:
        meta = json.load(read_file)
        acs = []
        msa = []
        for r in meta:
            if 'var' in r:
                filename = 'data/output/census/' + r['key'] + '.csv'
                if os.path.isfile(filename):
                    csv = pd.read_csv(
                        filename, dtype={'GEOID': object}
                    ).set_index(indexes)
                    df = csv.groupby(level=csv.index.names).last()
                    acs.append(df)
                elif r['var'] != '99999999':
                    frames = []
                    errors = []
                    for y in range(2010, 2019):
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
                                        print(i.text)
                                        errors.append(i.url)
                                    except:
                                        pass

                            print('Loaded:', r['name'], y, s)
                            print('-----')
                            if errors:
                                print('Retrying', len(errors), 'errors')

                    ind = pd.Series(pd.concat(frames), name=r['key'])
                    ind.to_csv(filename, header=r['key'])
                    acs.append(ind)

                filename = 'data/output/msa/' + r['key'] + '.csv'
                if os.path.isfile(filename):
                    csv = pd.read_csv(
                        filename, dtype={'GEOID': object}
                    ).set_index(indexes)
                    df = csv.groupby(level=csv.index.names).last()
                    msa.append(df)
                elif r['var'] != '99999999':
                    frames = []
                    for y in range(2010, 2019):
                        urls = ['https://api.census.gov/data/' + str(y) + \
                            '/acs/acs5?get=' + r['var'] + \
                            '&for=metropolitan statistical area/micropolitan statistical area:*' + \
                            '&key=' + settings.CENSUS_API]
                        rs = (grequests.get(u) for u in urls)
                        res = grequests.map(rs)
                        frames = process_result(res[0], y, r['var'], indexes, frames)
                    ind = pd.Series(pd.concat(frames), name=r['key'])
                    ind.to_csv(filename, header=r['key'])
                    msa.append(ind)

        combined = combine_files(
            acs,
            geo,
            ['STATEFP', 'COUNTYFP', 'TRACTCE', 'AFFGEOID', 'NAME', 'AWATER', 'LSAD', 'CBSAFP'],
            indexes
        )
        msa_combo = combine_files(
            msa,
            msa_geo,
            ['AFFGEOID', 'NAME', 'AWATER', 'LSAD', 'CBSAFP'],
            msa_indexes
        )

        for d in meta:
            print(d['name'])
            if 'upload' in d and d['upload']:
                indexes.append(d['key'])
                if 'msa' in d and d['msa']:
                    msa_indexes.append(d['key'])
            if 'inflation' in d:
                combined[d['key']] = update_dollars(pd.Series(combined[d['key']], name=d['key']))
                msa_combo[d['key']] = update_dollars(pd.Series(msa_combo[d['key']], name=d['key']))
            if 'var' not in d:
                if 'sum' in d:
                    combined[d['key']] = 0
                    if 'msa' in d and d['msa']:
                        msa_combo[d['key']] = 0
                    for s in d['sum']:
                        combined[d['key']] = combined[d['key']] + combined[s]
                        if 'msa' in d and d['msa']:
                            msa_combo[d['key']] = msa_combo[d['key']] + msa_combo[s]
                else:
                    combined[d['key']] = combined[d['numerator']].divide(
                        combined[d['denominator']],
                        fill_value=0
                    )
                    if 'msa' in d and d['msa']:
                        msa_combo[d['key']] = msa_combo[d['numerator']].divide(
                            msa_combo[d['denominator']],
                            fill_value=0
                        )
                    if 'scale' in d:
                        combined[d['key']] = combined[d['key']] * d['scale']
                        if 'msa' in d and d['msa']:
                            msa_combo[d['key']] = msa_combo[d['key']] * d['scale']

        export_msa = msa_combo.reset_index()
        export_msa_filtered = export_msa[
            export_msa.GEOID.isin([str(i) for i in combined.msaid.unique().tolist()])
        ]
        export_msa_filtered[msa_indexes].to_csv('data/output/census_msa.csv', index=False)
        replace_data('census_msa', msa_indexes, 'census_msa.csv')

        indexes.append('msaid')
        export = combined.reset_index()
        export[indexes].to_csv('data/output/census.csv', index=False)
        replace_data('census', indexes, 'census.csv')

if __name__ == "__main__":
    download_census()
