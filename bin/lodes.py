import os
from string import Template
import gzip
import pandas as pd
import requests
import us

CW = Template('https://lehd.ces.census.gov/data/lodes/LODES7/${state}/${state}_xwalk.csv.gz')
CW_FILE = Template('data/census/lodes/crosswalks/${state}.csv.gz')

WAC = Template('https://lehd.ces.census.gov/data/lodes/LODES7/${state}/wac/${state}_wac_S000_JT00_${year}.csv.gz')
WAC_FILE = Template('data/census/lodes/wac/${state}_${year}.csv.gz')

fips = us.states.mapping('fips', 'abbr')
states = pd.read_csv('data/geojson/tracts/cbsa_crosswalk.csv')['STATEFP'].unique().tolist()

for s in states:
    abbr = fips[str(s).zfill(2)].lower()
    gz = CW_FILE.substitute(state=abbr)
    csv = gz[:-3]
    if not os.path.isfile(gz) and not os.path.isfile(csv):
        cw = requests.get(CW.substitute(state=abbr))
        with open(gz, 'wb') as f:
            f.write(cw.content)
            f.close()

    if not os.path.isfile(csv):
        with gzip.open(gz, 'rb') as f:
            with open(csv, 'w') as c:
                c.write(f.read())
                c.close()
                os.remove(gz)

    for y in range(2010, 2016):
        wac = WAC_FILE.substitute(state=abbr, year=y)
        wcsv = wac[:-3]
        if not os.path.isfile(wac) and not os.path.isfile(wcsv):
            wc = requests.get(WAC.substitute(state=abbr, year=y))
            with open(wac, 'wb') as f:
                f.write(wc.content)
                f.close()

        if not os.path.isfile(wcsv):
            with gzip.open(wac, 'rb') as f:
                with open(wcsv, 'w') as c:
                    c.write(f.read())
                    c.close()
                    os.remove(wac)
