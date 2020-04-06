rm data/geojson/msa_tracts/*

mapshaper data/geojson/tracts/**/*.shp combine-files \
  -merge-layers force \
  -simplify 10% \
  -o data/geojson/tracts/us_tracts.shp force

mapshaper data/geojson/tracts/us_tracts.shp \
  -points centroid \
  -join data/geojson/cbsa/cb_2017_us_cbsa_500k.shp fields=CBSAFP \
  -join data/output/msa.csv keys=CBSAFP,msaid fields=msaid \
  -filter "msaid != null" \
  -o data/geojson/tracts/cbsa_crosswalk.csv

mapshaper data/geojson/tracts/us_tracts.shp \
  -join data/geojson/tracts/cbsa_crosswalk.csv field-types=GEOID:string keys=GEOID,GEOID fields=msaid \
  -filter "msaid != null" \
  -rename-layers tract \
  -split msaid \
  -filter-fields GEOID \
  -rename-fields id=GEOID \
  -proj EPSG:3395 \
  -o data/geojson/msa_tracts format=geojson singles force

for f in data/geojson/msa_tracts/*
  do
    mv $f data/geojson/msa_tracts/tract-${f##*/}
  done

mapshaper data/geojson/states/admin1_polygons.json \
  -simplify 0.5 \
  -filter-fields ISO3166_2 \
  -rename-fields id=ISO3166_2 \
  -o data/output/states.json format=topojson force
  