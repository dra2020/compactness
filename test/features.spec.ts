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
      const featureEntry: number[] = featureEntries[i];
      const featureSet = featureEntry.slice(1, -1) as T.CompactnessFeatures;
      const score: number = featureEntry[featureEntry.length-1];

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
      // const n = featureEntries[i][0];       IGNORE
      const correct = featureEntries[i].slice(1, -1) as T.CompactnessFeatures;
      // const score = featureEntries[i][-1];  IGNORE

      const features: T.CompactnessFeatures = featureizePoly(shapes.features[i]);
  
      // Compare computed feature values to the correct answers
      expect(features[T.CompactnessFeature.Reock]).toBeCloseTo(correct[T.CompactnessFeature.Reock]);
      expect(features[T.CompactnessFeature.Polsby]).toBeCloseTo(correct[T.CompactnessFeature.Polsby]);
      expect(features[T.CompactnessFeature.Hull]).toBeCloseTo(correct[T.CompactnessFeature.Hull]);
      // TODO - Why only one digit matching?
      expect(features[T.CompactnessFeature.Schwartzberg]).toBeCloseTo(correct[T.CompactnessFeature.Schwartzberg], 1);

      expect(features[T.CompactnessFeature.Sym_x]).toBeCloseTo(correct[T.CompactnessFeature.Sym_x]);
      // TODO - Why only one digit matching?
      expect(features[T.CompactnessFeature.Sym_y]).toBeCloseTo(correct[T.CompactnessFeature.Sym_y], 1);

      expect(features[T.CompactnessFeature.Bbox]).toBeCloseTo(correct[T.CompactnessFeature.Bbox]);
    }
  });
});


// TEST SCORING REFERENCE SHAPES (FEATURE-IZE + SCORE)

describe('Score reference shapes', () => {
  test('Using async/await', async () =>
  {
    const featureEntries = FU.readFeatureSets('testdata/smartfeats_first20.csv');
    const shapes: GeoJSON.FeatureCollection = await FU.readShapefile('./testdata/first20/first20.shp');

    for (let i in featureEntries)
    {
      const features: T.CompactnessFeatures = featureizePoly(shapes.features[i]);

      const featureEntry: number[] = featureEntries[i];
      const score: number = featureEntry[featureEntry.length-1];

      const prediction: number = scoreFeatureSet(features);

      // TODO - Why only one digit matching?
      expect(prediction).toBeCloseTo(score, 1);
    }
  });
});
