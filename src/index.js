import React from "react";
import ReactDOM from "react-dom";

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
  <Provider {...stores}>
    <CookiesProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </CookiesProvider>
  </Provider>,
  document.getElementById("root")
);
