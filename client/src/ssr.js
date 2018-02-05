import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import decode from "jwt-decode";

import "./index.css";

import reducer from "./reducer";
import setAuthHeader from "./utils/auth-header";
import * as api from "./api";
import Socket from "./socket";
import { userAdd } from "./actions/user";
import App from "./App";

export default function SSR(url, token) {
  const store = createStore(reducer, applyMiddleware(thunk));

  Socket(token, store);

  if (token) {
    setAuthHeader(token);
    return api.user.user().then(({ name, email, status, rate }) => {
      userAdd(name, email, status, rate)(store.dispatch);
      renderApp();
    });
  }

  renderApp();

  function renderApp() {
    return renderToString(
      <Provider store={store}>
        <Router location={url} context={{}}>
          <App />
        </Router>
      </Provider>
    );
  }
}
