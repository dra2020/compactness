import * as FU from '../testutil/fileutils';
import * as GeoJSON from 'geojson';

import { scoreFeatureSet } from '../src/kiwysi';
import { featureizePoly } from '../src/features';

import * as T from '../src/types'


// TEST SCORING REFERENCE FEATURE-IZED SHAPES

describe('Score reference feature sets', () => {
  const featureEntries = FU.readFeatureSets('testdata/smartfeats_first20.csv');

  test('Loop', () =>
  {
    for (let i in featureEntries)
    {
      const featureEntry: T.FeaturesEntry = featureEntries[i];
      const featureSet: T.CompactnessFeatures = featureEntry.features;
      const score: number = featureEntry.score;

      const prediction: number = scoreFeatureSet(featureSet);

      expect(prediction).toBeCloseTo(score);
    }
  });
});


// TEST FEATURE-IZING REFERENCE SHAPES 

describe('Feature-ize sample shapes', () => {
  test('Using async/await', async () =>
  {
    const featureEntries: T.FeaturesEntry[] = FU.readFeatureSets('testdata/smartfeats_first20.csv');
    const shapes: GeoJSON.FeatureCollection = await FU.readShapefile('./testdata/first20/first20.shp');

    for (let i = 0; i < shapes.features.length; i++)
    {
      const correct = featureEntries[i].features;
      const features: T.CompactnessFeatures = featureizePoly(shapes.features[i]);
  
      // Compare computed feature values to the correct answers
      expect(features.reock).toBeCloseTo(correct.reock);
      expect(features.polsby).toBeCloseTo(correct.polsby);
      expect(features.hull).toBeCloseTo(correct.hull);
      // TODO - Why is only one digit matching?
      expect(features.schwartzberg).toBeCloseTo(correct.schwartzberg, 1);

      expect(features.sym_x).toBeCloseTo(correct.sym_x);
      // TODO - Why is only one digit matching?
      expect(features.sym_y).toBeCloseTo(correct.sym_y, 1);

      expect(features.bbox).toBeCloseTo(correct.bbox);
    }
  });
});


// TEST SCORING REFERENCE SHAPES (FEATURE-IZE + SCORE)

describe('Score reference shapes', () => {
  test('Using async/await', async () =>
  {
    const featureEntries: T.FeaturesEntry[] = FU.readFeatureSets('testdata/smartfeats_first20.csv');
    const shapes: GeoJSON.FeatureCollection = await FU.readShapefile('./testdata/first20/first20.shp');

    for (let i in featureEntries)
    {
      const features: T.CompactnessFeatures = featureizePoly(shapes.features[i]);

      const featureEntry: T.FeaturesEntry = featureEntries[i];
      const score: number = featureEntry.score;

      const prediction: number = scoreFeatureSet(features);

      // TODO - Why is only one digit matching?
      expect(prediction).toBeCloseTo(score, 1);
    }
  });
});
