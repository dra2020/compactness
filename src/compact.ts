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


// TODO
// FEATURE-IZE A SHAPE

export function featureizeShape(poly: GeoJSON.Feature): T.FeatureSet
{

  const area: number = Poly.polyAreaFlat(poly);
  const perimeter: number = Poly.polyPerimeterFlat(poly);
  const diameter: number = Poly.polyDiameterFlat(poly);

  const features: T.FeatureSet = {
    sym_x: 1,
    sym_y: 2,
    reock: 3,
    bbox: 4,
    polsby: 5,
    hull: 6,
    schwartzberg: 7
  };

  return features;
}


// SCORE THE FEATURES FROM A FEATURE-IZED SHAPE

const { multiply } = require('mathjs');

export function scoreFeatureSet(features: number[]): number
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
