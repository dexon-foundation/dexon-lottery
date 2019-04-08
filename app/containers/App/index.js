/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import styled from 'styled-components';

import Console from './Console';
import Timer from './Timer';

const AppWrapper = styled.div`
  max-width: 830px;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  padding: 10px 0;

  display: flex;
  flex-direction: column;
`;

const App = () => (
  <AppWrapper>
    <Console />

    <Timer />
  </AppWrapper>
);

export default App;
