import * as topojson from 'topojson-client';

const atlasMSAFunctions = {
  drawTracts({
    msa,
    tractTopo,
    layers,
    // projection,
    geoPath,
  }) {
    const tractGeo = topojson.feature(
      tractTopo,
      tractTopo.objects[`tract-${msa.msaId}`],
    );

    return layers.tracts.selectAll('.atlas__tract')
      .data(tractGeo.features)
      .enter()
      .append('path')
      .attrs({
        d: geoPath,
        'stroke-width': 1,
        stroke: 'black',
        fill: 'none',
      });
  },
  zoomTracts({
    transform,
    tracts,
  }) {
    tracts.attrs({
      transform: `translate(${transform.x},${transform.y})scale(${transform.k})`,
      'stroke-width': 1 / transform.k,
    });
  },
};

export default atlasMSAFunctions;
