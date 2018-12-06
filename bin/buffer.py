#%%
import os
import geopandas as gp

dists = [402.34, 804.67, 1609.34]

#%%
stops = gp.read_file('data/output/stops.geojson')
hf = stops[stops['high_frequency'] == True].to_crs(epsg=3395)

b250 = gp.GeoDataFrame(
    gp.GeoSeries(hf.buffer(402.34))
).rename(columns={0:'geometry'}).set_geometry('geometry')
i250 = b250.sindex

b500 = gp.GeoDataFrame(
    gp.GeoSeries(hf.buffer(804.67))
).rename(columns={0:'geometry'}).set_geometry('geometry')
i500 = b500.sindex

b1000 = gp.GeoDataFrame(
    gp.GeoSeries(hf.buffer(1609.34))
).rename(columns={0:'geometry'}).set_geometry('geometry')
i1000 = b1000.sindex

buf = [
    {
        'geo': b250,
        'ind': i250,
        'dist': 0.25
    },
    {
        'geo': b500,
        'ind': i500,
        'dist': 0.5
    },
    {
        'geo': b1000,
        'ind': i1000,
        'dist': 1
    }
]

#%%
def test_overlap(r):
    for b in buf:
        possible_matches_index = list(b['ind'].intersection(r.geometry.bounds))
        possible_matches = b['geo'].iloc[possible_matches_index]
        precise_matches = possible_matches[possible_matches.intersects(r.geometry)]
        if not precise_matches.empty:
            r['dist'] = b['dist']
            break

    return r

tpath = 'data/geojson/msa_tracts/'
tracts = os.listdir(tpath)
for t in tracts:
    tr = gp.read_file(tpath + t).to_crs(epsg=3395)
    print 'Loaded', t
    tr['dist'] = 99
    tr1 = gp.GeoDataFrame(tr.apply(test_overlap, axis=1), crs='epsg:3395')
    with open(tpath + t, 'w') as gj:
        gj.write(tr1.to_json())
        gj.close()

#%%
os.system('for f in data/geojson/msa_tracts/*.json; do mapshaper $f -proj +init=EPSG:4326 from=+init=EPSG:3395 -o data/output/tracts/${f##*/} format=topojson; done')
