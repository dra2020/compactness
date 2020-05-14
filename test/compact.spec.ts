import * as FU from '../testutil/fileutils';
import * as GeoJSON from 'geojson';

import * as T from '../src/types'

import { scoreFeatureSet, featureizeShape } from '../src/compact';

describe('Score reference feature sets', () => {
  const verbose = false;
  const featureEntries = FU.readFeatureSets('testdata/smartfeats_first20.csv');

  test('Loop', () =>
  {
    for (let i in featureEntries)
    {
      const featureEntry: number[] = featureEntries[i];
      const featureSet = featureEntry.slice(1, -1) as T.FeatureSet;
      const score: number = featureEntry[featureEntry.length-1];

      const prediction: number = scoreFeatureSet(featureSet);

      expect(prediction).toBeCloseTo(score);
      if (verbose) console.log(`Sample: Prediction = ${prediction}, Answer = ${score}`);
    }
  });
});

export function testFeatureizeShapes(shapes: GeoJSON.FeatureCollection, featureEntries: T.FeaturesEntry[]): void
{
  const verbose = false;

  // console.log(`Processing ${shapes.features.length} shapes:`);
  for (let i = 0; i < 1 /* TODO - shapes.features.length */; i++)
  {
    const n = featureEntries[i][0];
    const correct = featureEntries[i].slice(1, -1) as T.FeatureSet;
    const score = featureEntries[i][-1];

    // console.log('Processing shape:', i + 1, '=', shapes.features[i]);
    const features: T.FeatureSet = featureizeShape(shapes.features[i]);

    // Compare feature values
    expect(features[T.Feature.Reock]).toEqual(correct[T.Feature.Reock]);
    expect(features[T.Feature.Polsby]).toEqual(correct[T.Feature.Polsby]);
    expect(features[T.Feature.Hull]).toEqual(correct[T.Feature.Hull]);
    expect(features[T.Feature.Schwartzberg]).toEqual(correct[T.Feature.Schwartzberg]);

    // More ...
  }
}

describe('Feature-ize reference shapes', () => {
  test('Loop', () =>
  {
    const featureEntries = FU.readFeatureSets('testdata/smartfeats_first20.csv');
    FU.readAndProcessShapes('./testdata/first20/first20.shp', testFeatureizeShapes, featureEntries);

    // expect(true).toBe(true);
  });
});
