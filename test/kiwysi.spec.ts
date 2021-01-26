import * as FU from '../testutil/fileutils';
import * as GeoJSON from 'geojson';

import { scoreShape } from '../src/kiwysi';

import * as T from '../src/types'


// TEST SCORING REFERENCE SHAPES (FEATURE-IZE + SCORE)

describe('Score the first 20 reference shapes', () => {
  test('Using async/await', async () =>
  {
    const featureEntries: T.FeaturesEntry[] = FU.readFeatureSets('testdata/first20/smartfeats_first20.csv');
    const shapes: GeoJSON.FeatureCollection = await FU.readShapefile('./testdata/first20/first20.shp');

    for (let i in featureEntries)
    {
      const featureEntry: T.FeaturesEntry = featureEntries[i];
      const score: number = featureEntry.score;

      const prediction: number = scoreShape(shapes.features[i], T.PCAModel.Original);

      // TODO - Why is only one digit matching?
      expect(prediction).toBeCloseTo(score, 1);
    }
  });
});

/* TODO - Not working ...
describe('Score the evenly spaced 20 reference shapes', () => {
  test('Using async/await', async () =>
  {
    const featureEntries: T.FeaturesEntry[] = FU.readFeatureSets('testdata/evenlyspaced20/evenlyspaced20.csv');
    const shapes: GeoJSON.FeatureCollection = await FU.readShapefile('./testdata/evenlyspaced20/evenlyspaced20.shp');

    for (let i in featureEntries)
    {
      const featureEntry: T.FeaturesEntry = featureEntries[i];
      const score: number = featureEntry.score;

      const prediction: number = scoreShape(shapes.features[i], T.PCAModel.Revised);

      // TODO - Why is only one digit matching?
      expect(prediction).toBeCloseTo(score, 1);
    }
  });
});
*/
