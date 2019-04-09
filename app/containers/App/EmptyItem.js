import React from 'react';
import styled, { keyframes } from 'styled-components';

const blink = keyframes`
  from, to {
    color: transparent;
  }

  50% {
    color: white;
  }
`;

const Marker = styled.span`
  animation: ${blink} 1s step-end infinite;
`;

const Item = styled.div`
  flex: 1 0 auto;
  display: flex;
  align-items: flex-end;
  white-space: pre;
`;

const LotteryItem = () => (
  <Item>
    Place your bets! We will have a lucky winner soon...<Marker>_</Marker>
  </Item>
);

export default LotteryItem;
