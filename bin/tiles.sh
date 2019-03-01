mapshaper data/geojson/transit/**/routes.geojson combine-files \
  -merge-layers force \
  -filter "operated_by_name != 'Amtrak'" \
  -filter-fields high_frequency,name,operated_by_name,vehicle_type \
  -o data/output/routes.geojson

python bin/ta_names.py

./bin/stops.sh

tippecanoe data/output/*.geojson -aD -aG -ab -ai -f -o data/output/transit.mbtiles

source .env

mapbox upload axismaps.axj75ry4 data/output/transit.mbtiles
