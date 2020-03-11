"""
Download and parse private primary jobs (JT03) from LEHD
"""

#%%
import os
from string import Template
import gzip
import pandas as pd
import requests
import us

CW = Template('https://lehd.ces.census.gov/data/lodes/LODES7/${st}/${st}_xwalk.csv.gz')
CW_FILE = Template('data/census/lodes/crosswalks/${st}.csv.gz')

WAC = Template(
    'https://lehd.ces.census.gov/data/lodes/LODES7/${st}/wac/${st}_wac_S000_JT03_${yr}.csv.gz'
)
WAC_FILE = Template('data/census/lodes/wac/${st}_${yr}.csv.gz')

fips = us.states.mapping('fips', 'abbr')
states = pd.read_csv('data/geojson/tracts/cbsa_crosswalk.csv')['STATEFP'].unique().tolist()

print('Imported libraries and set constants')

#%%
groups = []
for s in states:
    abbr = fips[str(s).zfill(2)].lower()
    gz = CW_FILE.substitute(st=abbr)
    csv = gz[:-3]
    if not os.path.isfile(gz) and not os.path.isfile(csv):
        cw = requests.get(CW.substitute(st=abbr))
        with open(gz, 'wb') as f:
            f.write(cw.content)
            f.close()

    if not os.path.isfile(csv):
        with gzip.open(gz, 'rb') as f:
            with open(csv, 'w') as c:
                c.write(f.read())
                c.close()
                os.remove(gz)

    frames = []
    for y in range(2010, 2018):
        wac = WAC_FILE.substitute(st=abbr, yr=y)
        wcsv = wac[:-3]
        if not os.path.isfile(wac) and not os.path.isfile(wcsv):
            wc = requests.get(WAC.substitute(st=abbr, yr=y))
            if wc.status_code == 200:
                with open(wac, 'wb') as f:
                    f.write(wc.content)
                    f.close()

        if not os.path.isfile(wcsv) and os.path.isfile(wac):
            with gzip.open(wac, 'rb') as f:
                with open(wcsv, 'wb') as c:
                    c.write(f.read())
                    c.close()
                    os.remove(wac)

        if os.path.isfile(wcsv):
            df = pd.read_csv(
                wcsv,
                dtype={'w_geocode': object},
                index_col=0,
                usecols=['w_geocode', 'C000']
            )
            df['year'] = y
            frames.append(df)

    geo = pd.read_csv(
        csv,
        dtype={
            'tabblk2010': object,
            'trct': object
        },
        index_col=0,
        usecols=['tabblk2010', 'trct']
    )
    combined = pd.concat(frames).merge(
        geo, left_index=True, right_index=True
    )
    groups.append(combined.groupby(['trct', 'year']).sum())

print('Loaded and parsed state data')
#%%
tracts = pd.read_csv(
    'data/geojson/tracts/cbsa_crosswalk.csv',
    dtype={'GEOID': object},
    usecols=['GEOID', 'msaid']
)
full = pd.concat(groups).reset_index().merge(tracts, left_on='trct', right_on='GEOID')
full.to_csv(
    'data/output/census/jobs.csv',
    columns=['trct', 'year', 'C000'],
    header=['GEOID', 'year', 'jobs']
)

print('Wrote jobs.csv')
