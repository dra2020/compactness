import { hello } from '../src/index';

describe('Hello, world!', () => {
  it('Responds true', () => {
    expect(hello()).toBe(true);
  });
});
