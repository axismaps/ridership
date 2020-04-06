# %%
import os
import geopandas as gp

dists = [402.34, 804.67, 1609.34]

# %%
hf = gp.read_file(os.path.join(os.path.dirname(
    __file__), '../data/output/stops_high_frequency.geojson'), crs='epsg:3395')

# %%
b250 = hf.copy()
b250['geometry'] = hf.buffer(402.34)
i250 = b250.sindex

b500 = hf.copy()
b500['geometry'] = hf.buffer(804.67)
i500 = b500.sindex

b1000 = hf.copy()
b1000['geometry'] = hf.buffer(1609.34)
i1000 = b1000.sindex

buf = [
    {
        'geo': b250,
        'ind': i250,
        'dist': 0.25,
        'name': 'i250'
    },
    {
        'geo': b500,
        'ind': i500,
        'dist': 0.5,
        'name': 'i500',
    },
    {
        'geo': b1000,
        'ind': i1000,
        'dist': 1,
        'name': 'i1000'
    }
]

# %%


def test_overlap(r):
    for b in buf:
        possible_matches_index = list(b['ind'].intersection(r.geometry.bounds))
        possible_matches = b['geo'].iloc[possible_matches_index]
        precise_matches = possible_matches[possible_matches.intersects(
            r.geometry)]
        if not precise_matches.empty:
            r[b['name']] = precise_matches['taid'].unique().tolist()

    return r


tpath = os.path.join(os.path.dirname(__file__), '../data/geojson/msa_tracts/')
tracts = os.listdir(tpath)
for t in tracts:
    tr = gp.read_file(tpath + t)
    print('Loaded', t)
    tr1 = gp.GeoDataFrame(tr.apply(test_overlap, axis=1), crs='epsg:3395')
    with open(tpath + t, 'w') as gj:
        gj.write(tr1.to_json())
        gj.close()

# %%
os.system(
    'for f in data/geojson/msa_tracts/*.json; do mapshaper $f -proj +init=EPSG:4326 from=+init=EPSG:3395 -o data/output/tracts/${f##*/} format=topojson; done')
