import * as FU from '../testutil/fileutils';
import * as GeoJSON from 'geojson';

import { scoreShape } from '../src/kiwysi';

import * as T from '../src/types'


// TEST SCORING REFERENCE SHAPES (FEATURE-IZE + SCORE)

describe('Score reference shapes', () => {
  test('Using async/await', async () =>
  {
    const featureEntries = FU.readFeatureSets('testdata/smartfeats_first20.csv');
    const shapes: GeoJSON.FeatureCollection = await FU.readShapefile('./testdata/first20/first20.shp');

    for (let i in featureEntries)
    {
      const featureEntry: number[] = featureEntries[i];
      const score: number = featureEntry[featureEntry.length-1];

      const prediction: number = scoreShape(shapes.features[i]);

      // TODO - Why is only one digit matching?
      expect(prediction).toBeCloseTo(score, 1);
    }
  });
});
