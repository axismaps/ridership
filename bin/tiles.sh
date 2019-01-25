mapshaper data/geojson/transit/**/routes.geojson combine-files \
  -merge-layers force \
  -filter "operated_by_name != 'Amtrak'" \
  -filter-fields high_frequency,name,operated_by_name,vehicle_type \
  -o data/output/routes.geojson

python bin/ta_names.py

mapshaper data/geojson/transit/**/stops.geojson combine-files \
  -merge-layers force \
  -filter-fields high_frequency,name,tags \
  -o data/output/stops.geojson

tippecanoe data/output/*.geojson -aD -aG -ab -ai -f -o data/output/transit.mbtiles

source .env

mapbox upload axismaps.axj75ry4 data/output/transit.mbtiles
