mapshaper data/geojson/transit/**/stops.geojson combine-files \
  -merge-layers force \
  -filter-fields high_frequency,name,operators_serving_stop \
  -each 'for (var i = 0; i <= 4; i++) { this.properties["op" + i] = "99999999" }' \
  -each 'operators_serving_stop.forEach((o, i) => { this.properties["op" + i] = o.operator_name })' \
  -join data/meta/ta_names.csv keys=op0,name1 unmatched \
  -o data/output/stops-unmatched.geojson target=unmatched \
  -filter "taid !== null" \
  -o data/output/stops-matched.geojson

for o in {0..4}
  do
    for n in {1..8}
      do
        echo $o $n
        mapshaper data/output/stops-unmatched.geojson \
          -join data/meta/ta_names.csv keys=op$o,name$n unmatched \
          -o data/output/stops-unmatched.geojson force target=unmatched \
          -filter "taid !== null" \
          -o data/output/stops-matched$o$n.geojson force
      done
  done

mapshaper data/output/stops-*.geojson combine-files \
  -merge-layers force \
  -filter remove-empty \
  -filter-fields high_frequency,name,taid \
  -each 'this.properties.taid = this.properties.taid || 9999' \
  -o data/output/stops.geojson

rm data/output/stops-*.geojson

mapshaper data/output/stops.geojson \
  -filter "high_frequency === true" remove-empty \
  -proj EPSG:3395 \
  -o data/output/stops_high_frequency.geojson
