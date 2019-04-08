/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Import polyfills first
import 'babel-polyfill';

// Import all the third party stuff
import React from 'react';
import ReactDOM from 'react-dom';
import FontFaceObserver from 'fontfaceobserver';
import 'sanitize.css/sanitize.css';

// Load the favicon and the .htaccess file
import '!file-loader?name=[name].[ext]!./images/favicon.ico';
import 'file-loader?name=[name].[ext]!./.htaccess'; // eslint-disable-line import/extensions

// Import root app
import App from './containers/App';

// Import CSS reset and Global Styles
import './global-styles';

// Observe loading of Overpass (to remove Overpass, remove the <link> tag in
// the index.html file and this observer)
const overpassObserver = new FontFaceObserver('Overpass Mono', {});

// When Overpass is loaded, add a font-family using Overpass to the body
overpassObserver.load().then(() => {
  document.body.classList.add('fontLoaded');
});

// Create redux store with history
const MOUNT_NODE = document.getElementById('app');

const render = () => {
  ReactDOM.render(
    <App />,
    MOUNT_NODE,
  );
};

render();
