// @flow
import React from 'react';
import styled from 'styled-components';
import InlineSVG from 'react-inlinesvg';
import type { SVGProps } from './types';

export const StyledSVG = styled(InlineSVG)`
  display: flex;
  align-items: center;
`;

const SVG = ({ src, ...props }: SVGProps) => (src ? (
  <StyledSVG cacheGetRequests src={src} {...props} />
) : null);

export default SVG;
