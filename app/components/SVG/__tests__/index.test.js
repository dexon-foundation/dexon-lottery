import React from 'react';
import { shallow } from 'enzyme';

import SVG, { StyledSVG } from '../';

jest.mock('react-inlinesvg', () => 'div');

describe('<SVG />', () => {
  it('should render empty component', () => {
    const wrapper = shallow(
      <SVG />
    );

    expect(wrapper.html()).toBeNull();
  });

  it('should render SVG', () => {
    const wrapper = shallow(
      <SVG src="/test.svg" />
    );

    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('should pass props down to svg', () => {
    const wrapper = shallow(
      <SVG src="/test.svg" className="className" />
    );

    expect(wrapper.find(StyledSVG).prop('className')).toBe('className');
  });
});
