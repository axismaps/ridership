import re
import pandas as pd
import geopandas as gpd
from carto import replace_data

COLORS = [
    '#00ad91',
    '#ff5e4d',
    '#eb52d6',
    '#ff9d2e',
    '#8c6112',
    '#0f8fff',
    '#33a02c',
    '#c2ab00',
    '#707070',
    '#bc80bd'
]

def clean_ta(ta, drop):
    # Remove missing NTD ID's
    ta = ta.dropna(how='all')

    # Combine project ID's
    ta['Project ID'] = ta['Project ID'].combine_first(
        ta['"Other" primary Project ID']
    ).astype('int32')
    ta['Agency Name'] = ta['Agency Name'].combine_first(
        ta['Reporter Acronym']
    )

    #Create display column
    ta['display'] = ta['ShowIndividual'].astype('bool')

    # Drop unused columns
    return ta.drop(columns=drop)

def make_match_name(name):
    matches = re.search(r"(\s|\w|\.)*", name)
    return matches.group(0)

def make_match_state(name):
    matches = re.search(r"[A-Z]{2}", name)
    return matches.group(0)

def load_csa():
    csa = gpd.read_file('data/geojson/cbsa/cb_2017_us_cbsa_500k.shp')
    csa['centx'] = csa.centroid.x
    csa['centy'] = csa.centroid.y
    csa['name_match'] = csa['NAME'].apply(make_match_name)
    csa['state_match'] = csa['NAME'].apply(make_match_state)
    merge = pd.merge(csa, csa.bounds, how='inner', left_index=True, right_index=True)
    return merge.drop(columns=['CSAFP', 'CBSAFP', 'AFFGEOID', 'LSAD',
                               'ALAND', 'AWATER', 'geometry'])

def main():
    # Load the excel data:
    TA = pd.read_excel('data/meta/Transit_Agencies_for_Visualization.xlsx',
                       sheet_name='TC AgencyList')

    print 'Data successfully loaded from Excel'

    DROP = ['ShowIndividual', '"Other" primary Project ID', 'Primary UZA']
    agencies = clean_ta(TA, DROP)
    agencies['name_match'] = agencies['UZA Name'].apply(make_match_name)
    agencies['state_match'] = agencies['UZA Name'].apply(make_match_state)

    csa = load_csa()
    merge = pd.merge(agencies, csa, how='inner', on=['name_match', 'state_match'])

    # Export TA metadata
    tamerge = merge[
        ['Project ID', 'Agency Name', 'Reporter Acronym', 'GEOID', 'display']
    ].rename(
        columns={
            'Project ID': 'taid',
            'Agency Name': 'taname',
            'Reporter Acronym': 'tashort',
            'GEOID': 'msaid'
        }
    )

    prev_msa = 0
    color_count = 0
    for i, row in tamerge.iterrows():
        if row.msaid == prev_msa:
            color_count += 1
            if color_count >= len(COLORS):
                color_count = 0
        else:
            color_count = 0
            prev_msa = row.msaid
        tamerge.at[i, 'color'] = COLORS[color_count]

    tamerge.to_csv('data/output/ta.csv', index=False)
    replace_data('ta', ['taid', 'taname', 'tashort', 'msaid', 'display', 'color'], 'ta.csv')

    # Export MSA metadata
    msa_header = ['name', 'centx', 'centy', 'minx', 'miny', 'maxx', 'maxy']
    geo = merge[['GEOID', 'NAME', 'centx', 'centy', 'minx', 'miny', 'maxx', 'maxy']]
    geo = geo.groupby('GEOID').first()
    geo.to_csv('data/output/msa.csv', index_label='msaid',
               header=msa_header)

    replace_data('msa', ['msaid'] + msa_header, 'msa.csv')

if __name__ == "__main__":
    main()
