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
      const features: number[] = shapes[i].slice(0, -1);
      const prediction: number = scoreFeatureSet(features);

      const score: number = shapes[i].slice(-1)[0];

      expect(prediction).toBeCloseTo(score);
      if (verbose) console.log(`Sample: Prediction = ${prediction}, Answer = ${score}`);
    }
  });
});

export function testSampleShapes(shapes: GeoJSON.FeatureCollection): void
{
  // console.log(`Processing ${shapes.features.length} shapes:`);
  for (let i = 0; i < shapes.features.length; i++)
  {
    // console.log('Processing shape:', i + 1, '=', shapes.features[i]);
    const features = featureizeShape(shapes.features[i]);

    // TODO - HERE
    let correct: T.FeatureSet = {
      sym_x: 0,
      sym_y: 0,
      reock: 0,
      bbox: 0,
      polsby: 0,
      hull: 0,
      schwartzberg: 0
    };

    // TODO - What should this be?
    expect(features).toEqual(correct);
  }
}

describe('Feature-ize reference shapes', () => {
  test('Loop', () =>
  {
    FU.readAndProcessShapes('./testdata/first20/first20.shp', testSampleShapes);
  });
});
