mapshaper data/geojson/transit/**/routes.geojson combine-files \
  -merge-layers force \
  -join data/output/ta.csv keys=operated_by_name,talong \
  -filter "taid != null" \
  -filter-fields taid,msa_color,high_frequency,name,operated_by_name,tags,vehicle_type \
  -o data/output/routes_match_long.geojson

mapshaper data/geojson/transit/**/routes.geojson combine-files \
  -merge-layers force \
  -join data/output/ta.csv keys=operated_by_name,tashort \
  -filter "taid != null" \
  -filter-fields taid,msa_color,high_frequency,name,operated_by_name,tags,vehicle_type \
  -o data/output/routes_match_short.geojson

mapshaper data/geojson/transit/**/routes.geojson combine-files \
  -merge-layers force \
  -join data/output/ta.csv keys=operated_by_name,talong \
  -filter "taid == null" \
  -filter-fields high_frequency,name,operated_by_name,tags,vehicle_type \
  -join data/output/ta.csv keys=operated_by_name,tashort \
  -filter "taid == null" \
  -filter-fields taid,msa_color,high_frequency,name,operated_by_name,tags,vehicle_type \
  -o data/output/routes_match_none.geojson

mapshaper data/output/routes_match*.geojson combine-files \
  -merge-layers force \
  -o data/output/routes.geojson

rm data/output/routes_match*.geojson

mapshaper data/geojson/transit/**/stops.geojson combine-files \
  -merge-layers force \
  -filter-fields high_frequency,name,tags \
  -o data/output/stops.geojson

tippecanoe data/output/*.geojson -aD -aG -ab -ai -f -o data/output/transit.mbtiles
