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
import App from "./App";
import reducer from "./reducers";

import registerServiceWorker from "./registerServiceWorker";

import setAuthHeader from "./utils/auth-header";
import { USER_LOGIN } from "./constants";

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

const token = localStorage.user_jwt;
if (token) {
  const { email, name } = decode(token);
  const user = { token, email, name };
  setAuthHeader(token);
  store.dispatch({
    type: USER_LOGIN,
    user
  });
}

const app = (
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));

registerServiceWorker();
