mapshaper data/geojson/transit/**/routes.geojson combine-files \
  -merge-layers force \
  -filter "operated_by_name != 'Amtrak'" \
  -filter-fields high_frequency,operated_by_name,vehicle_type \
  -dissolve high_frequency,operated_by_name,vehicle_type \
  -simplify 10% no-repair \
  -o data/output/routes.geojson

./bin/stops.sh

python bin/ta_names.py

tippecanoe data/output/*.geojson -aD -aG -ab -ai -f -o data/output/transit.mbtiles
