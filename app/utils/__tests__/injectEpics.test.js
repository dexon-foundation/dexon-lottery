/**
 * Test injectors
 */

import { memoryHistory } from 'react-router-dom';
import { shallow } from 'enzyme';
import React from 'react';

import configureStore from '../../configureStore';
import injectEpics from '../injectEpics';
import * as epicsInjectors from '../epicsInjectors';

// Fixtures
const Component = () => null;

const testEpic = action$ => (
  action$
    .ofType('ping')
    .mapTo({ type: 'pong' })
);
const testEpics = [testEpic];

describe('injectSaga decorator', () => {
  let store;
  let injectors;
  let ComponentWithEpics;

  beforeAll(() => {
    epicsInjectors.default = jest.fn().mockImplementation(() => injectors);
  });

  beforeEach(() => {
    store = configureStore({}, memoryHistory);
    injectors = {
      injectEpics: jest.fn(),
      ejectEpics: jest.fn(),
    };
    ComponentWithEpics = injectEpics({
      key: 'test',
      epics: testEpics,
    })(Component);
    epicsInjectors.default.mockClear();
  });

  it('should inject given saga, mode, and props', () => {
    const props = { test: 'test' };
    shallow(<ComponentWithEpics {...props} />, { context: { store } });

    expect(injectors.injectEpics).toHaveBeenCalledTimes(1);
    expect(injectors.injectEpics).toHaveBeenCalledWith(
      'test',
      testEpics,
      props,
    );
  });

  it('should eject on unmount with a correct saga key', () => {
    const props = { test: 'test' };
    const renderedComponent = shallow(<ComponentWithEpics {...props} />, {
      context: { store },
    });
    renderedComponent.unmount();

    expect(injectors.ejectEpics).toHaveBeenCalledTimes(1);
    expect(injectors.ejectEpics).toHaveBeenCalledWith('test');
  });

  it('should set a correct display name', () => {
    expect(ComponentWithEpics.displayName).toBe('withEpics(Component)');
    expect(
      injectEpics({ key: 'test', epics: testEpics })(() => null).displayName,
    ).toBe('withEpics(Component)');
  });

  it('should propagate props', () => {
    const props = { testProp: 'test' };
    const renderedComponent = shallow(<ComponentWithEpics {...props} />, {
      context: { store },
    });

    expect(renderedComponent.prop('testProp')).toBe('test');
  });
});
