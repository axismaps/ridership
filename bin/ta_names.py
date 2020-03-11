#%%
import pandas as pd
import geopandas as gp
from meta import clean_ta

#%%
routes = gp.read_file('data/output/routes.geojson')
TA = pd.read_excel('data/meta/Transit_Agencies_for_Visualization.xlsx',
                   sheet_name='TC AgencyList')
tas = clean_ta(TA, ['ShowIndividual', '"Other" primary Project ID', 'Primary UZA', 'UZA Name'])
print('Data loaded')

#%%
def lookup_table(value, df):
    """
    :param value: value to find the dataframe
    :param df: dataframe which constains the lookup table
    :return:
        A String representing a the data found
    """
    # Variable Initialization for non found entry in list
    out = None
    for index, row in df.iterrows():
        if value in row.tolist():
            out = row['Project ID']
            break
    return out

routes['taid'] = routes['operated_by_name'].apply(lambda x: lookup_table(x, tas))
print('Joined with TA data')

#%%
ta2 = pd.read_csv('data/output/ta.csv')
routes = routes.merge(ta2, how='left', on='taid')
export = routes[['taid', 'msa_color', 'high_frequency', 'operated_by_name', 'vehicle_type', 'geometry']]
print('Joined with color data')

#%%
with open('data/output/routes.geojson', 'w') as gj:
    gj.write(export.to_json())
    gj.close()
print('File written')
