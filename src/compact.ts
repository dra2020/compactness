//
// KIWYSI COMPACTNESS
//

import * as Poly from '@dra2020/poly';
import * as GeoJSON from 'geojson';

import * as T from './types'


export function scoreShape(): number
{
  console.log("Hello, world!");

  // TODO - Feature-ize the shape
  // TODO - Score the feature set

  return 42;
}


// FEATURE-IZE A SHAPE
// TODO
export function featureizeShape(poly: GeoJSON.Feature): T.FeatureSet
{
  // Calc Reock & Polsby-Popper features
  const result = Poly.polyCompactness(poly);

  // Geodesic poly attributes
  // const area: number = Poly.polyAreaFlat(poly);
  // const perimeter: number = Poly.polyPerimeterFlat(poly);
  // const diameter: number = Poly.polyDiameterFlat(poly);

  const features: T.FeatureSet = [
    0,  // sym_x
    0,  // sym_y
    result.reock,                          // Geodesic
    // calcReock(area, diameter),          // Cartesian
    0,  // bbox
    result.polsby_popper,                  // Geodesic
    // calcPolsbyPopper(area, perimeter),  // Cartesian
    result.convex_hull,
    result.schwartzberg
  ];

  return features;
}

// Cloned from dra-score/compact.ts
function calcReock(area: number, diameter: number): number
{
  return (4 * area) / (Math.PI * diameter ** 2);
}

// Cloned from dra-score/compact.ts
function calcPolsbyPopper(area: number, perimeter: number): number
{
  return (4 * Math.PI) * (area / perimeter ** 2);
}


// SCORE THE FEATURES FROM A FEATURE-IZED SHAPE

const { multiply } = require('mathjs');

export function scoreFeatureSet(features: T.FeatureSet): number
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
