//
// KIWYSI COMPACTNESS
//

import * as GeoJSON from 'geojson';
import * as Poly from '@dra2020/poly';

import { featureizePoly } from './features';
import * as T from './types';
import * as M from './matrix';


export function scoreShape(poly: any, options?: Poly.PolyOptions): number
{
  // Feature-ize the shape
  const features: T.CompactnessFeatures = featureizePoly(poly, options);

  // Score the feature set
  const score: number = scoreFeatureSet(features);

  return score;
}

export function scoreShapes(shapes: GeoJSON.FeatureCollection, options?: Poly.PolyOptions): number[]
{
  let scores: number[] = [];

  for (let i = 0; i < shapes.features.length; i++)
  {
    scores.push(scoreShape(shapes.features[i], options));
  }

  return scores;
}


// SCORE THE FEATURES FROM A FEATURE-IZED SHAPE

// MathJS dependency removed 09/29/2020
// const { multiply } = require('mathjs');

export function scoreFeatureSet(features: T.CompactnessFeatures): number
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

  const score = M.dotProduct(model, features);
  // MathJS dependency removed 09/29/2020
  // const score = M.multiply(model, features);
  const normalized = (score * 11) + 50;

  return normalized;
}



