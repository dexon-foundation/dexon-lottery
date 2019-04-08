import { fromJS } from 'immutable';

const storeFake = state => ({
  default: () => {},
  subscribe: () => {},
  dispatch: () => {},
  getState: () => (fromJS(state)),
});

export default storeFake;
