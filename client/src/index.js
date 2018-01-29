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

import reducer from "./state/reducer";
import registerServiceWorker from "./registerServiceWorker";
import setAuthHeader from "./utils/auth-header";
import { userApi } from "./api";
import { createLogin } from "./state/user.state";
import Socket from "./socket";
import App from "./App";

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

const token = localStorage.user_jwt;
Socket(token, store);
if (token) {
  setAuthHeader(token);
  userApi
    .user()
    .then(({ name, email, status, money }) =>
      store.dispatch(createLogin({ name, email, status, money, token }))
    );
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
