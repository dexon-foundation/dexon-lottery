/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import styled from 'styled-components';

import MainHome from '@/containers/MainHome/Loadable';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const App = () => (
  <AppWrapper>
    <MainHome />
  </AppWrapper>
);

export default App;
