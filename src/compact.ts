//
// KIWYSI COMPACTNESS
//

// TODO - For testing
import * as Poly from '@dra2020/poly';
import * as GeoJSON from 'geojson';


// TODO
export function scoreShape(): number
{
  console.log("Hello, world!");
  return 42;
}


// TODO
// FEATURE-IZE A SHAPE

export function featureizeShape(poly: GeoJSON.Feature): any
{

  const area: number = Poly.polyAreaFlat(poly);
  const perimeter: number = Poly.polyPerimeterFlat(poly);
  const diameter: number = Poly.polyDiameterFlat(poly);

  return [area, perimeter, diameter];
}

// TODO
export function processShapes(shapes: GeoJSON.FeatureCollection): void
{
  console.log(`Processing ${shapes.features.length} shapes:`);
  for (let i = 0; i < shapes.features.length; i++)
  {
    console.log('Processing shape:', i + 1, '=', shapes.features[i]);
  }
}


// SCORE THE FEATURES FROM A FEATURE-IZED SHAPE

const { multiply } = require('mathjs');

export function scoreFeatures(features: number[]): number
{
  const model: number[] = [
    0.317566717356693,  // sym_x
    0.32545234315137,   // sym_y
    0.32799567316863,   // reock
    0.411560782484889,  // bbox
    0.412187169816954,  // polsby
    0.420085928286392,  // hull
    0.412187169816954   // schwartzberg
  ];

  const score = multiply(model, features);
  const normalized = (score * 11) + 50;

  return normalized;
}
