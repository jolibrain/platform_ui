import React from 'react';
import { render } from '@testing-library/react';

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

import { rest } from 'msw'
import { setupServer } from 'msw/node'

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

const fs = require('fs');
const configPath = '../../public/config.json';

const server = setupServer(
    rest.get('config.json', (req, res, ctx) => {
        console.log(req)
        let configFile = fs.readFileSync(configPath)
        let configJson = JSON.parse(configFile)
        console.log(configJson)
        return res(ctx.json(configJson))
    })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders Predict link', async () => {
    const { getByText } = render(
        <Provider {...stores}>
          <HashRouter>
            <App />
          </HashRouter>
        </Provider>);
    const linkElement = getByText(/Predict/i);
    expect(linkElement).toBeInTheDocument();
});
