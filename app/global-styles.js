import { injectGlobal } from 'styled-components';
import { COLOR_WHITE, COLOR_BLUE } from '@/constants/colors';

/* eslint no-unused-expressions: 0 */
injectGlobal`
  html,
  body {
    width: 100%;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'Overpass', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: ${COLOR_WHITE};
    min-height: 100%;
    min-width: 100%;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  a:hover {
    color: ${COLOR_BLUE};
  }

  ul, ol {
    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 0.5em;
    list-style-position: inside;
  }

  li {
    margin: .1em 0;
  }
`;
