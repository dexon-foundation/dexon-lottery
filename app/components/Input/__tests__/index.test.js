import React from 'react';
import { shallow } from 'enzyme';

import Input from '../index';

describe('<Input />', () => {
  it('should match snapshot', () => {
    const renderedComponent = shallow(<Input />);
    expect(renderedComponent).toMatchSnapshot();
  });
});
