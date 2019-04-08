/**
 *
 * Button.js
 *
 * A common button, if you pass it a prop "route" it'll render a link to a react-router route
 * otherwise it'll render a link with an onclick
 */

import React from 'react';
import styled from 'styled-components';
import { clickableStyle } from '@/utils/styles';

const StyledButton = styled.button`
  position: relative;
  padding: 10px 20px;
  border-radius: 3px;
  user-select: none;
  font-size: 12px;
  outline: 0;
  border: 1px solid #5E6C75;
  color: #122028;

  ${clickableStyle}
`;

type ButtonProps = {
  className: String,
  onClick: Function,
  children: any,
  isDisabled: Boolean,
};

const Button = ({ className, onClick, children, isDisabled }: ButtonProps) => (
  <StyledButton
    isDisabled={isDisabled}
    className={className}
    onClick={onClick}
  >
    {children}
  </StyledButton>
);

export default Button;
