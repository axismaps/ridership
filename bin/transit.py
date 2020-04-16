"""Script to run transitland download script via commandline from MSA CSV"""

import re
import os
from string import Template
import pandas as pd

msa = pd.read_csv('data/output/msa.csv')
cmd = Template('python bin/transitland/buildmsa.py --outpath="data/geojson/transit/${name}"\
               --bbox="${minx},${miny},${maxx},${maxy}" --dates=2018-09-19 \
               --high_frequency_headway=900')
path = 'data/geojson/transit/'

for index, row in msa.iterrows():
    name = re.sub(r"\W+", '_', row['name'], 0, re.MULTILINE).lower() + '/'
    if (not os.path.isfile(path + name + 'routes.geojson')
            or not os.path.isfile(path + name + 'stops.geojson')):
        os.system(cmd.substitute(
            name=name,
            minx=row['minx'],
            miny=row['miny'],
            maxx=row['maxx'],
            maxy=row['maxy']
        ))

    for f in os.listdir(path + name):
        if (not f == 'routes.geojson' and not f == 'stops.geojson'):
            os.remove(path + name + f)
    print('******', name, '******')
