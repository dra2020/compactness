//
// KIWYSI COMPACTNESS
//

import * as T from './types';


export function scoreShape(): number
{
  console.log("Hello, world!");

  // TODO - Feature-ize the shape
  // TODO - Score the feature set

  return 42;
}


// SCORE THE FEATURES FROM A FEATURE-IZED SHAPE

const { multiply } = require('mathjs');

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

  const score = multiply(model, features);
  const normalized = (score * 11) + 50;

  return normalized;
}



