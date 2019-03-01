mapshaper data/geojson/transit/**/stops.geojson combine-files \
  -merge-layers force \
  -filter-fields high_frequency,name,tags \
  -o data/output/stops.geojson
