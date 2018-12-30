import re
import os
from string import Template
import pandas as pd

msa = pd.read_csv('data/output/msa.csv')
cmd = Template('python bin/transitland/buildmsa.py --outpath="data/geojson/transit/${name}"\
               --bbox="${minx},${miny},${maxx},${maxy}" --dates=2018-08-26')

for index, row in msa.iterrows():
    name = re.sub(r"\W+", '_', row['name'], 0, re.MULTILINE).lower()
    os.system(cmd.substitute(
        name=name,
        minx=row['minx'],
        miny=row['miny'],
        maxx=row['maxx'],
        maxy=row['maxy']
    ))
