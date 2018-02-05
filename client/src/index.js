import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
//import decode from "jwt-decode";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import decode from "jwt-decode";

import "./index.css";

import registerServiceWorker from "./registerServiceWorker";
import setAuthHeader from "./utils/auth-header";
import * as api from "./api";
import Socket from "./socket";
import reducer from "./reducer";
import { userAdd } from "./actions/user";
import App from "./App";

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
//const store = createStore(reducer, applyMiddleware(thunk));

const token = localStorage.user_jwt;
Socket(token, store);

if (token) {
  setAuthHeader(token);
  api.user.user().then(({ name, email, status, rate }) => {
    store.dispatch(userAdd(name, email, token, rate, status));
    renderApp();
  });
} else {
  renderApp();
}

function renderApp() {
  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>,
    document.getElementById("root")
  );

  registerServiceWorker();
}
