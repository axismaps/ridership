import re
import json
import pandas as pd
import geopandas as gpd

def clean_ta(ta, drop):
    # Remove missing NTD ID's
    ta = ta.dropna(how='all')

    # Combine project ID's
    # ta['Project ID'] = ta['Project ID'].combine_first(
    #     ta['"Other" primary Project ID']
    # ).astype('int32')
    ta['Agency Name'] = ta['Agency Name'].combine_first(
        ta['Reporter Acronym']
    )

    # Drop unused columns
    return ta.drop(columns=drop)

def make_match_name(name):
    matches = re.search(r"(\s|\w)*", name)
    return matches.group(0)

def load_csa():
    csa = gpd.read_file('data/geojson/cbsa/cb_2017_us_cbsa_500k.shp')
    csa['centx'] = csa.centroid.x
    csa['centy'] = csa.centroid.y
    csa['name_match'] = csa['NAME'].apply(make_match_name)
    merge = pd.merge(csa, csa.bounds, how='inner', left_index=True, right_index=True)
    return merge.drop(columns=['CSAFP', 'CBSAFP', 'AFFGEOID', 'LSAD',
                               'ALAND', 'AWATER', 'geometry'])

def make_json(df):
    d = {}
    for i, row in df.iterrows():
        gid = row['GEOID']
        pid = row['Project ID']
        if gid not in d:
            d[gid] = row[['NAME', 'centx', 'centy',
                          'minx', 'miny', 'maxx', 'maxy']].to_dict()
            d[gid]['agencies'] = {}

        j = len(d[gid]['agencies'])
        ta_info = row[['Agency Name', 'Reporter Acronym']].to_dict()
        if pid:
            d[gid]['agencies'][j] = ta_info
        else:
            if 'sub' not in d[gid]['agencies'][j]:
                d[gid]['agencies'][j]['sub'] = {}
            k = len(d[gid]['agencies'][j]['sub'])
            d[gid]['agencies'][j]['sub'][k] = ta_info

    return d

def main():
    # Load the excel data:
    TA = pd.read_excel('data/meta/Transit_Agencies_for_Visualization.xlsx',
                       sheet_name='TC AgencyList')

    print 'Data successfully loaded from Excel'

    DROP = ['ShowIndividual', '"Other" primary Project ID', 'Primary UZA']
    agencies = clean_ta(TA, DROP)
    agencies['name_match'] = agencies['UZA Name'].apply(make_match_name)

    csa = load_csa()
    merge = pd.merge(agencies, csa, how='left', on='name_match')
    merge = merge.drop(columns=['UZA Name', 'name_match'])

    with open('data/output/ta.json', 'w') as fp:
        json.dump(make_json(merge), fp, indent=2)

    # group.to_json('data/output/ta.json', orient='index')

if __name__ == "__main__":
    main()
