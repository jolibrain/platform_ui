import React from "react";
import ReactDOM from "react-dom";

import { HashRouter } from "react-router-dom";
import { configure } from "mobx";
import { Provider } from "mobx-react";

import "./styles/styles.css";

import App from "./components/App";

import commonStore from "./stores/commonStore.js";
import configStore from "./stores/configStore.js";
import gpuStore from "./stores/gpuStore.js";
import deepdetectStore from "./stores/deepdetectStore.js";
import imaginateStore from "./stores/imaginateStore.js";
import modelRepositoriesStore from "./stores/modelRepositoriesStore.js";
import dataRepositoriesStore from "./stores/dataRepositoriesStore.js";
import modalStore from "./stores/modalStore.js";
import authTokenStore from "./stores/authTokenStore.js";

const stores = {
  commonStore,
  configStore,
  gpuStore,
  deepdetectStore,
  imaginateStore,
  modelRepositoriesStore,
  dataRepositoriesStore,
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
    <HashRouter>
      <App />
    </HashRouter>
  </Provider>,
  document.getElementById("root")
);
