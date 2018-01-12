import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
//import decode from "jwt-decode";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import decode from "jwt-decode";

import reducer from "./state/reducer";
import registerServiceWorker from "./registerServiceWorker";
import setAuthHeader from "./utils/auth-header";
import {createLogin} from "./state/user.state";
import Socket from "./socket";
import App from "./App";

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));

const IO = Socket(store);

const token = localStorage.user_jwt;
if (token) {
  const { email, name } = decode(token);
  setAuthHeader(token);
  IO.opponentsIO.add(name);
  store.dispatch(createLogin(name, email,  token ));
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
