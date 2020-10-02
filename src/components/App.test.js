import React from 'react';
import { render , screen, waitFor, prettyDOM } from '@testing-library/react';

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

test('Shows right sidebar when servers in gpuInfo config.json', async () => {

  const { container, getByText } = render(
    <Provider {...stores}>
      <HashRouter>
        <App configPath="/mocks-config-gpuInfo-servers.json"/>
      </HashRouter>
    </Provider>);

  const rightSidebarElement = container.getElementsByClassName('right-sidebar')[0];
  console.log(prettyDOM(rightSidebarElement))

  const gpuElement = await waitFor(() =>  getByText(/Mock GPU Stats/i));
  expect(gpuElement).toBeInTheDocument();

  const mainViewElement = container.getElementsByClassName('main-view')[0];
  expect(mainViewElement.className.split(" ").indexOf('with-right-sidebar')).not.toBe(-1);

});

test('Hides right sidebar when no servers in gpuInfo config.json', async () => {

  const { container, getByText } = render(
    <Provider {...stores}>
      <HashRouter>
        <App configPath="/mocks-config-gpuInfo-no-servers.json"/>
      </HashRouter>
    </Provider>);

  const rightSidebarElement = container.getElementsByClassName('right-sidebar')[0];
  console.log(prettyDOM(rightSidebarElement))

  const gpuElement = await waitFor(() =>  getByText(/GPU Stats/i));
  expect(gpuElement).not.toBeInTheDocument();

  const mainViewElement = container.getElementsByClassName('main-view')[0];
  expect(mainViewElement.className.split(" ").indexOf('with-right-sidebar')).toBe(-1);

});
