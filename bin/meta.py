import pandas as pd
import geopandas as gpd

def clean_ta(ta, drop):
    # Remove missing NTD ID's
    ta = ta.dropna(how='all')

    # Combine project ID's
    ta['Project ID'] = ta['Project ID'].combine_first(
        ta['"Other" primary Project ID']
    ).astype('int32')

    # Drop unused columns
    return ta.drop(columns=drop)

def load_csa():
    csa = gpd.read_file('data/geojson/csa/cb_2017_us_csa_500k.shp')
    csa['centroid'] = csa.centroid
    return csa.drop(columns=['CSAFP', 'AFFGEOID', 'LSAD', 'ALAND', 'AWATER'])

def main():
    # Load the excel data:
    TA = pd.read_excel('data/meta/Transit_Agencies_for_Visualization.xlsx',
                       sheet_name='TC AgencyList')

    print 'Data successfully loaded from Excel'

    DROP = ['ShowIndividual', '"Other" primary Project ID', 'Primary UZA']
    agencies = clean_ta(TA, DROP)

    csa = load_csa()

    agencies.to_csv('data/output/ta.csv', index_label='id')

if __name__ == "__main__":
    main()
