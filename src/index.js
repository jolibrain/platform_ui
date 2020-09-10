import React from "react";
import ReactDOM from "react-dom";

import * as serviceWorker from './serviceWorker';

import { HashRouter } from "react-router-dom";
import { configure } from "mobx";
import { Provider } from "mobx-react";
import { CookiesProvider } from "react-cookie";

import "./styles/styles.scss";

import App from "./components/App";

import configStore from "./stores/configStore";
import buildInfoStore from "./stores/buildInfoStore";
import gpuStore from "./stores/gpuStore";
import deepdetectStore from "./stores/deepdetectStore";
import imaginateStore from "./stores/imaginateStore";
import modelRepositoriesStore from "./stores/modelRepositoriesStore";
import dataRepositoriesStore from "./stores/dataRepositoriesStore";
import datasetStore from "./stores/datasetStore";
import modalStore from "./stores/modalStore";
import authTokenStore from "./stores/authTokenStore";

const stores = {
  configStore,
  buildInfoStore,
  gpuStore,
  deepdetectStore,
  imaginateStore,
  modelRepositoriesStore,
  dataRepositoriesStore,
  datasetStore,
  modalStore,
  authTokenStore
};

// For easier debugging
window._____APP_STATE_____ = stores;

configure({
  enforActions: true
});

ReactDOM.render(
  <React.StrictMode>
    <Provider {...stores}>
      <CookiesProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </CookiesProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
