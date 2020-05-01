import { scoreFeatures } from '../src/compact';

describe('Score feature', () => {
  test('Reference shape #1', () =>
  {
    const features: number[] = [1.40982845893268, 1.46233715704051, 0.293969427544707, 0.576015395500123, 0.228918698162065, 0.70676215091718, 2.09006294795715];
    expect(scoreFeatures(features)).toBeCloseTo(77.6086471426305);
  });
});
