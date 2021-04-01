import React from 'react';
import { render , screen, waitFor } from '@testing-library/react';

import { Provider } from "mobx-react";
import { HashRouter } from "react-router-dom";

import configStore from "../stores/configStore";
import buildInfoStore from "../stores/buildInfoStore";
import gpuStore from "../stores/gpuStore";
import deepdetectStore from "../stores/deepdetectStore";
import imaginateStore from "../stores/imaginateStore";
import modelRepositoriesStore from "../stores/modelRepositoriesStore";
import dataRepositoriesStore from "../stores/dataRepositoriesStore";
import datasetStore from "../stores/datasetStore";
import videoExplorerStore from "./stores/videoExplorerStore";
import modalStore from "../stores/modalStore";
import authTokenStore from "../stores/authTokenStore";

import App from './App';

const stores = {
  configStore,
  buildInfoStore,
  gpuStore,
  deepdetectStore,
  imaginateStore,
  modelRepositoriesStore,
  dataRepositoriesStore,
  datasetStore,
  videoExplorerStore,
  modalStore,
  authTokenStore
};

test('renders Predict link', async () => {
    const { getByText } = render(
        <Provider {...stores}>
          <HashRouter>
            <App />
          </HashRouter>
        </Provider>);
    const linkElement = await waitFor(() =>  getByText(/Predict/i));
    expect(linkElement).toBeInTheDocument();
});

test('use custom config path', async () => {
    const { getByText } = render(
        <Provider {...stores}>
          <HashRouter>
            <App configPath="/mocks-config.json"/>
          </HashRouter>
        </Provider>);
    const mockElement = await waitFor(() =>  getByText(/Mock/i));
    expect(mockElement).toBeInTheDocument();
});
