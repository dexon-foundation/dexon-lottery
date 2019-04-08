/**
 * Test injectors
 */

import { memoryHistory } from 'react-router-dom';

import configureStore from '../../configureStore';
import getInjectors, {
  injectEpicsFactory,
  ejectEpicsFactory,
} from '../epicsInjectors';

const testEpic = action$ => (
  action$
    .ofType('ping')
    .mapTo({ type: 'pong' })
);
const testEpic2 = action$ => (
  action$
    .ofType('ping2')
    .mapTo({ type: 'pong2' })
);
const testEpics = [testEpic];

describe('injectors', () => {
  let store;
  let injectEpics;
  let ejectEpics;

  describe('getInjectors', () => {
    beforeEach(() => {
      store = configureStore({}, memoryHistory);
    });

    it('should return injectors', () => {
      expect(getInjectors(store)).toEqual(
        expect.objectContaining({
          injectEpics: expect.any(Function),
          ejectEpics: expect.any(Function),
        }),
      );
    });

    it('should throw if passed invalid store shape', () => {
      Reflect.deleteProperty(store, 'dispatch');

      expect(() => getInjectors(store)).toThrow();
    });
  });

  describe('ejectEpics helper', () => {
    beforeEach(() => {
      store = configureStore({}, memoryHistory);
      injectEpics = injectEpicsFactory(store, true);
      ejectEpics = ejectEpicsFactory(store, true);
    });

    it('should check a store if the second argument is falsy', () => {
      const eject = ejectEpicsFactory({});

      expect(() => eject('test')).toThrow();
    });

    it('should dispatch ejection action', () => {
      store.dispatch = jest.fn();
      injectEpics('test', testEpics);
      ejectEpics('test');

      expect(store.dispatch).toHaveBeenCalledWith({ type: 'STOP_EPICS_OF_KEY_test' });
    });

    it("should validate epics's key", () => {
      expect(() => ejectEpics('')).toThrow();
      expect(() => ejectEpics(1)).toThrow();
    });

    it('should ignore epics that was not previously injected', () => {
      expect(() => ejectEpics('test')).not.toThrow();
    });

    it('should remove non daemon epics after ejectopm', () => {
      injectEpics('test', testEpics);
      injectEpics('test1', testEpics);

      ejectEpics('test');
      ejectEpics('test1');

      expect(store.injectedEpics.test).toBe(undefined);
      expect(store.injectedEpics.test1).toBe(undefined);
    });
  });

  describe('injectEpics helper', () => {
    beforeEach(() => {
      store = configureStore({}, memoryHistory);
      injectEpics = injectEpicsFactory(store, true);
      ejectEpics = ejectEpicsFactory(store, true);
    });

    it('should check a store if the second argument is falsy', () => {
      const inject = injectEpicsFactory({});

      expect(() => inject('test', testEpics)).toThrow();
    });

    it('it should not check a store if the second argument is true', () => {
      Reflect.deleteProperty(store, 'dispatch');

      expect(() => injectEpics('test', testEpics)).not.toThrow();
    });

    it("should validate epics's key", () => {
      expect(() => injectEpics('', testEpics)).toThrow();
      expect(() => injectEpics(1, testEpics)).toThrow();
    });

    it('should validate epics', () => {
      expect(() => injectEpics('test')).toThrow();
      expect(() => injectEpics('test', 1)).toThrow();
      expect(() => injectEpics('test', [])).toThrow();
      expect(() => injectEpics('test', testEpics)).not.toThrow();
    });

    it('should call addEpics', () => {
      store.addEpic = jest.fn();
      injectEpics('test', testEpics);

      expect(store.addEpic).toHaveBeenCalledWith('test', testEpic);
    });

    it('should call addEpics for each epic', () => {
      store.addEpic = jest.fn();
      injectEpics('test', [
        testEpic,
        testEpic2,
      ]);

      expect(store.addEpic).toHaveBeenCalledTimes(2);
      expect(store.addEpic).toHaveBeenCalledWith('test', testEpic);
      expect(store.addEpic).toHaveBeenCalledWith('test', testEpic2);
    });

    it('should save an entire epics array in the epics registry', () => {
      injectEpics('test', testEpics);
      expect(store.injectedEpics.test).toBe(testEpics);
    });
  });
});
