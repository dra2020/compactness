import { hello } from '../src/compact';

describe('Hello, world!', () => {
  it('Responds true', () => {
    expect(hello()).toBe(true);
  });
});
