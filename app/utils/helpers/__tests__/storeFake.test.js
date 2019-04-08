import storeFake from '../storeFake';

describe('storeFake', () => {
  it('should execute normally', () => {
    expect(() => storeFake()).not.toThrow();
    expect(() => storeFake({})).not.toThrow();
    expect(() => storeFake({ foo: 'bar' })).not.toThrow();
  });

  it('should execute store methods normally', () => {
    const store = storeFake();

    expect(() => store.default()).not.toThrow();
    expect(() => store.subscribe()).not.toThrow();
    expect(() => store.dispatch()).not.toThrow();
    expect(() => store.getState()).not.toThrow();
  });

  it('should create a fake store with necessary methods', () => {
    const store = storeFake();

    expect(store).toHaveProperty('default');
    expect(store).toHaveProperty('subscribe');
    expect(store).toHaveProperty('dispatch');
    expect(store).toHaveProperty('getState');
  });

  it('should fill with proper state', () => {
    const mockState = {
      foo: 'bar',
      foo2: {
        foo3: 'baba',
      },
    };

    expect(storeFake(mockState)).toHaveProperty('getState');
    expect(storeFake(mockState).getState()).toHaveProperty('get');
    expect(storeFake(mockState).getState().get('foo')).toEqual('bar');
    expect(storeFake(mockState).getState().getIn(['foo2', 'foo3'])).toEqual('baba');
  });
});
