import * as FU from '../testutil/fileutils';
import * as GeoJSON from 'geojson';

import * as T from '../src/types'

import { scoreFeatureSet, featureizeShape } from '../src/compact';


// TEST SCORING SETS OF SHAPE FEATURES

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


// TEST FEATURE-IZING SHAPES 

describe('Feature-ize sample shapes', () => {
  test('Using async/await', async () =>
  {
    const featureEntries = FU.readFeatureSets('testdata/smartfeats_first20.csv');
    const shapes: GeoJSON.FeatureCollection = await FU.readShapefile('./testdata/first20/first20.shp');

    // console.log('Processing shapes:');
    for (let i = 0; i < 1 /* shapes.features.length */; i++)
    {
      const n = featureEntries[i][0];
      const correct = featureEntries[i].slice(1, -1) as T.FeatureSet;
      const score = featureEntries[i][-1];

      // console.log(i, shapes.features[i]);
  
      const features: T.FeatureSet = featureizeShape(shapes.features[i]);
  
      // Compare computed feature values to the correct answers
      expect(features[T.Feature.Reock]).toBeCloseTo(correct[T.Feature.Reock]);
      expect(features[T.Feature.Polsby]).toBeCloseTo(correct[T.Feature.Polsby]);
      // TOOD
      // expect(features[T.Feature.Hull]).toEqual(correct[T.Feature.Hull]);
      // expect(features[T.Feature.Schwartzberg]).toEqual(correct[T.Feature.Schwartzberg]);
  
      // TODO - Add the other features
    }
  });
});

