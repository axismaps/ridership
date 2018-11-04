mapshaper data/geojson/transit/**/routes.geojson combine-files -merge-layers force -filter-fields color,high_frequency,name,operated_by_name,tags,vehicle_type -o data/output/routes.geojson
mapshaper data/geojson/transit/**/stops.geojson combine-files -merge-layers force -filter-fields high_frequency,name,tags -o data/output/stops.geojson
tippecanoe data/output/*.geojson -aD -aG -ab -ai -f -o data/output/transit.mbtiles
