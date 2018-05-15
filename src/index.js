import React from 'react';
import ReactDOM from 'react-dom';

import { HashRouter } from 'react-router-dom';
import { configure } from 'mobx';
import { Provider } from 'mobx-react';

import "./styles/styles.css"

import App from './components/App';

import commonStore from './stores/commonStore.js';
import deepdetectStore from './stores/deepdetectStore.js';

const stores = {
  commonStore,
  deepdetectStore,
}

// For easier debugging
window._____APP_STATE_____ = stores;

configure({
	enforActions: true,
});

ReactDOM.render((
  <Provider {...stores}>
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>
), document.getElementById('root'));
