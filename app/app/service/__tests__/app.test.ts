import { appService } from '../app';

describe('App service', () => {
  test('', () => {
    expect(typeof appService.isDEBUG).toBe('boolean');
  });
});
