import * as FU from '../testutil/fileutils';
import * as GeoJSON from 'geojson';

import * as T from '../src/types'

import { scoreFeatureSet, featureizeShape } from '../src/compact';

describe('Score reference feature sets', () => {
  const verbose = false;
  const shapes = FU.readFeatureSets('testdata/smartfeats_first20.csv');

  test('Loop', () =>
  {
    for (let i in shapes)
    {
      const featureSet = shapes[i].slice(0, -1) as T.FeatureSet;
      const prediction: number = scoreFeatureSet(featureSet);

      const score: number = shapes[i].slice(-1)[0] as number;

      expect(prediction).toBeCloseTo(score);
      if (verbose) console.log(`Sample: Prediction = ${prediction}, Answer = ${score}`);
    }
  });
});

// TODO - Here
// * Pass the correct featureSets in
// * Extend T.FeatureSet to include the 'score'
export function testFeatureizeShapes(shapes: GeoJSON.FeatureCollection): void
{
  const verbose = false;
  const featureSets = FU.readFeatureSets('testdata/smartfeats_first20.csv');

  // console.log(`Processing ${shapes.features.length} shapes:`);
  for (let i = 0; i < 1 /* TODO - shapes.features.length */; i++)
  {
    const correct: T.FeatureSet = featureSets[i];

    // console.log('Processing shape:', i + 1, '=', shapes.features[i]);
    const features: T.FeatureSet = featureizeShape(shapes.features[i]);

    // Compare feature values
    expect(features[T.Feature.Reock]).toEqual(correct[T.Feature.Reock]);
    expect(features[T.Feature.Polsby]).toEqual(correct[T.Feature.Polsby]);
    expect(features[T.Feature.Hull]).toEqual(correct[T.Feature.Hull]);
    expect(features[T.Feature.Schwartzberg]).toEqual(correct[T.Feature.Schwartzberg]);

    // TODO - More ...
  }
}

describe('Feature-ize reference shapes', () => {
  test('Loop', () =>
  {
    FU.readAndProcessShapes('./testdata/first20/first20.shp', testFeatureizeShapes);
  });
});
