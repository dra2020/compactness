import * as FU from '../testutil/fileutils';

import { scoreFeatures } from '../src/compact';

describe('Score feature', () => {
  const shapes = FU.readFeaturesCSV('testdata/smartfeats_first20.csv');

  test('Reference shapes loop', () =>
  {
    for (let i in shapes)
    {
      const features: number[] = shapes[i].slice(0, -1);
      const prediction: number = scoreFeatures(features);

      const score: number = shapes[i].slice(-1)[0];

      expect(prediction).toBeCloseTo(score);
      // console.log(`Sample: Prediction = ${prediction}, Answer = ${score}`);
    }
  });
});
