import * as FU from '../testutil/fileutils';
import * as GeoJSON from 'geojson';

import { scoreFeatures } from '../src/compact';

describe('Score reference feature sets', () => {
  const shapes = FU.readSampleFeatureSets('testdata/smartfeats_first20.csv');

  test('Loop', () =>
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

describe('Feature-ize reference shapes', () => {
  const shapes: GeoJSON.FeatureCollection = FU.readSampleShapes('./testdata/first20/first20.shp');
  console.log(shapes.features[0]);

  test('Loop', () =>
  {
    // for (let i in shapes)
    // {
    //   const features: number[] = shapes[i].slice(0, -1);
    //   const prediction: number = scoreFeatures(features);

    //   const score: number = shapes[i].slice(-1)[0];

    //   expect(prediction).toBeCloseTo(score);
    //   // console.log(`Sample: Prediction = ${prediction}, Answer = ${score}`);
    // }
    expect(true).toBe(true);
  });
});
