/**
 * Test injectors
 */

import checkStore from '../checkStore';

describe('checkStore', () => {
  let store;

  beforeEach(() => {
    store = {
      dispatch: () => {},
      subscribe: () => {},
      getState: () => {},
      replaceReducer: () => {},
      addEpic: () => {},
      epicStopper: () => { },
      injectedReducers: {},
      injectedEpics: {},
    };
  });

  it('should not throw if passed valid store shape', () => {
    expect(() => checkStore(store)).not.toThrow();
  });

  it('should throw if passed invalid store shape', () => {
    expect(() => checkStore({})).toThrow();
    expect(() => checkStore({ ...store, injectedEpics: null })).toThrow();
    expect(() => checkStore({ ...store, injectedReducers: null })).toThrow();
    expect(() => checkStore({ ...store, addEpic: null })).toThrow();
    expect(() => checkStore({ ...store, epicStopper: null })).toThrow();
    expect(() => checkStore({ ...store, replaceReducer: null })).toThrow();
  });
});
