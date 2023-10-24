import React from "react";
import { createRoot } from "react-dom/client";
import LoadableApp from "./LoadableApp";
import reportWebVitals from './reportWebVitals';

import * as serviceWorker from './serviceWorker';

import { HashRouter } from "react-router-dom";
import { configure } from "mobx";
import { CookiesProvider } from "react-cookie";

import "./styles/styles.scss";

import store from "./stores/rootStore";
import { createContext } from "react";

const GlobalStore = createContext(store);

configure({
  enforActions: true
});

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <GlobalStore.Provider>
    <CookiesProvider>
      <HashRouter>
        <LoadableApp />
      </HashRouter>
    </CookiesProvider>
  </GlobalStore.Provider>
);


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
if (module.hot && process.env.NODE_ENV === "development") {
  module.hot.accept("./components/App", () => {
    root.render(
      <GlobalStore.Provider>
        <CookiesProvider>
          <HashRouter>
            <LoadableApp />
          </HashRouter>
        </CookiesProvider>
      </GlobalStore.Provider>
    );
  });
}
