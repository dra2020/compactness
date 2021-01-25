//
// KIWYSI COMPACTNESS
//

import * as GeoJSON from 'geojson';
import { Poly } from '@dra2020/baseclient';

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

export function scoreFeatureSet(features: T.CompactnessFeatures): number
{
  // NOTE - Original, incorrect, model (15 decimal places)
  const model: number[] = [
    0.317566717356693,  // sym_x
    0.32545234315137,   // sym_y
    0.32799567316863,   // reock
    0.411560782484889,  // bbox
    0.412187169816954,  // polsby
    0.420085928286392,  // hull
    0.412187169816954   // schwartzberg
  ];

  /* Revised model - 01/25/21 (10 decimal places)
  const model: number[] = [
    3.0428861122,       // sym_x
    4.5060390447,       // sym_y
    -22.7768820155,     // reock
    -24.1176096770,     // bbox
    -107.9434473497,    // polsby
    -67.1088897240,     // hull
    -1.2981693414       // schwartzberg
  ];

  const intercept: number = 145.6420811716;
  */

  const v: M.Vector = [
    features.sym_x,
    features.sym_y,
    features.reock,
    features.bbox,
    features.polsby,
    features.hull,
    features.schwartzberg
  ];

  const score = M.dotProduct(model, v);
  const normalized = (score * 11) + 50;

  return normalized;
}



