import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import invariant from 'invariant';

import checkStore from './checkStore';

const checkKey = key =>
  invariant(
    isString(key) && !isEmpty(key),
    '(app/utils...) injectEpics: Expected `key` to be a non empty string',
  );

const checkEpics = epics =>
  invariant(
    isArray(epics) && !isEmpty(epics),
    '(app/utils...) injectEpics: Expected `epics` to be an array of redux-observable epics',
  );

export function injectEpicsFactory(store, isValid) {
  return function injectEpics(key, epics) {
    if (!isValid) checkStore(store);

    checkKey(key);
    checkEpics(epics);

    if (!Reflect.has(store.injectedEpics, key)) {
      epics.forEach(epic => store.addEpic(key, epic));

      /* eslint-disable no-param-reassign */
      store.injectedEpics[key] = epics;
      /* eslint-enable no-param-reassign */
    }
  };
}

export function ejectEpicsFactory(store, isValid) {
  return function ejectEpics(key) {
    if (!isValid) checkStore(store);

    checkKey(key);

    if (Reflect.has(store.injectedEpics, key)) {
      store.dispatch({ type: store.epicStopper(key) });

      /* eslint-disable no-param-reassign */
      delete store.injectedEpics[key];
      /* eslint-enable no-param-reassign */
    }
  };
}

export default function getInjectors(store) {
  checkStore(store);

  return {
    injectEpics: injectEpicsFactory(store, true),
    ejectEpics: ejectEpicsFactory(store, true),
  };
}
