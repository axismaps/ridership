import pandas as pd
from maintenance import convert_ntd_id
from meta import clean_ta

FILES = {
    2013: {
        'file': 'data/meta/2013 Agency Information_0.xlsx',
        'id': 'NTDID',
        'legacy': True,
        'ind': 'Service Area Population'
    },
    2014: {
        'file': 'data/meta/2014-Agency-Information.xlsx',
        'id': '5 digit NTDID',
        'legacy': False,
        'ind': 'Service Area Pop'
    },
    2015: {
        'file': 'data/meta/2015_Agency_information_1.xlsx',
        'id': '5 Digit NTD ID',
        'legacy': False,
        'ind': 'Service Area Pop'
    },
    2016: {
        'file': 'data/meta/2016 Agency Information.xlsx',
        'id': '5 Digit NTD ID',
        'legacy': False,
        'ind': 'Service Area Pop'
    }
}

def load_population_year(pfile, nid, ind, legacy):
    pop_raw = pd.read_excel(pfile)[[nid, ind]]
    pop_raw[nid] = pd.to_numeric(pop_raw[nid], errors='coerce')
    pop_raw['population'] = pop_raw[ind]

    if legacy:
        pop_raw['NTD ID'] = convert_ntd_id(pop_raw[nid])
    else:
        pop_raw['NTD ID'] = pop_raw[nid]

    TA = pd.read_excel('data/meta/Transit_Agencies_for_Visualization.xlsx',
                       sheet_name='TC AgencyList')
    TA_DROP = ['ShowIndividual', 'Primary UZA', 'UZA Name', 'Agency Name',
               'Reporter Acronym', 'display', 'taname']
    ta_clean = clean_ta(TA, TA_DROP)[['Project ID', 'NTD ID']]

    pop = pd.merge(pop_raw, ta_clean, on="NTD ID").dropna().drop(columns=['NTD ID', nid, ind])
    return pop.groupby('Project ID').max().stack()

def get_population():
    population = pd.DataFrame()
    for year, f in FILES.iteritems():
        population[str(year)] = load_population_year(f['file'], f['id'], f['ind'], f['legacy'])
    return population.groupby('Project ID').max().stack()

if __name__ == "__main__":
    get_population()
