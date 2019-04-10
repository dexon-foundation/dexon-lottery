import React from 'react';
import styled from 'styled-components';
import ReactTypingEffect from 'react-typing-effect';

const Item = styled.div`
  flex: 1 0 auto;
  display: flex;
  align-items: flex-end;
  white-space: pre;
`;

const EmptyItem = () => (
  <Item>
    <ReactTypingEffect
      speed="100"
      text="Place your bet! We will have a lucky winner soon..."
    />
  </Item>
);

export default EmptyItem;
