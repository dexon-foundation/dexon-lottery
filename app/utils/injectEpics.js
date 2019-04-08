import React from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';

import getInjectors from './epicsInjectors';

/**
 * Dynamically injects a saga, passes component's props as saga arguments
 *
 * @param {string} key A key of the saga
 * @param {function} saga A root saga that will be injected
 * @param {string} [mode] By default (constants.RESTART_ON_REMOUNT) the saga will be started on component mount and
 * cancelled with `task.cancel()` on component un-mount for improved performance. Another two options:
 *   - constants.DAEMON—starts the saga on component mount and never cancels it or starts again,
 *   - constants.ONCE_TILL_UNMOUNT—behaves like 'RESTART_ON_REMOUNT' but never runs it again.
 *
 */
export default ({ key, epics }) => (WrappedComponent) => {
  class InjectEpics extends React.Component {
    static WrappedComponent = WrappedComponent;

    static displayName = `withEpics(${WrappedComponent.displayName ||
      WrappedComponent.name ||
      'Component'})`;

    static contextTypes = {
      store: PropTypes.object.isRequired,
    };

    componentWillMount() {
      const { injectEpics } = this.injectors;

      injectEpics(key, epics, this.props);
    }

    componentWillUnmount() {
      const { ejectEpics } = this.injectors;

      ejectEpics(key);
    }

    injectors = getInjectors(this.context.store);

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return hoistNonReactStatics(InjectEpics, WrappedComponent);
};
