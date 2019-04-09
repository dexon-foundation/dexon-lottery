import React from 'react';
import styled, { keyframes } from 'styled-components';
import moment from 'moment';

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
  display: none;
`;

const Item = styled.a`
  margin-top: 20px;
  flex: 1 0 auto;
  display: flex;
  align-items: flex-end;
  white-space: pre;
  cursor: pointer;

  &:last-child ${Marker} {
    display: block;
  }

  &:first-child {
    margin-top: 0;
  }

  &:hover {
    background: #222222;
  }
`;

const Gray = styled.span`
  color: #8d8d8d;
  display: contents;
`;

const LotteryItem = ({ timestamp, hash, number }: { timestamp: String, hash: String, number: String }) => (
  <Item
    target="_blank"
    href={`https://testnet.dexscan.app/transaction/${hash}`}
  >
    <Gray>{'Time:   '}</Gray>{moment(timestamp * 1000).format('MMM Do, LTS ZZ')}<br />
    <Gray>{'Number: '}</Gray>{number}<br />
    <Gray>{'TxHash: '}</Gray>{hash}<Marker>_</Marker>
  </Item>
);

export default LotteryItem;
