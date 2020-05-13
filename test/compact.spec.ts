import * as FU from '../testutil/fileutils';
import * as GeoJSON from 'geojson';

import { scoreFeatures } from '../src/compact';

describe('Score reference feature sets', () => {
  const verbose = false;
  const shapes = FU.readFeatureSets('testdata/smartfeats_first20.csv');

  test('Loop', () =>
  {
    for (let i in shapes)
    {
      const features: number[] = shapes[i].slice(0, -1);
      const prediction: number = scoreFeatures(features);

      const score: number = shapes[i].slice(-1)[0];

      expect(prediction).toBeCloseTo(score);
      if (verbose) console.log(`Sample: Prediction = ${prediction}, Answer = ${score}`);
    }
  });
});

export function processShapes(shapes: GeoJSON.FeatureCollection): void
{
  console.log(`Processing ${shapes.features.length} shapes:`);
  for (let i = 0; i < shapes.features.length; i++)
  {
    console.log('Processing shape:', i + 1, '=', shapes.features[i]);
  }
}

describe('Feature-ize reference shapes', () => {
  const shapes: GeoJSON.FeatureCollection = FU.readAndProcessShapes('./testdata/first20/first20.shp', processShapes);
  console.log(shapes.features[0]);

  test('Loop', () =>
  {
    // FU.readAndProcessSampleShapes('./testdata/first20/first20.shp', processShapes);

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
