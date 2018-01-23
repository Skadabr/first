import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import decode from "jwt-decode";

import "./index.css";

import reducer from "./state/reducer";
import setAuthHeader from "./utils/auth-header";
import { createLogin } from "./state/user.state";
import Socket from "./socket";
import App from "./App";

global.SSR = function SSR(url, token) {
  const store = createStore(reducer, applyMiddleware(thunk));

  Socket(token, store);
  if (token) {
    const { email, name } = decode(token);
    setAuthHeader(token);
    store.dispatch(createLogin(name, email, token)); }
  const app = (
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  );

  return renderToString(app);
}
