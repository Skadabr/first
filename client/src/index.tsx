import * as React from "react";
import * as ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import debounce from "lodash.debounce";

import "./index.css";

import setAuthHeader from "./utils/auth-header";
import * as api from "./api";
import Socket from "./socket";

import reducer from "./reducer";
import { userAdd } from "./actions/user";
import { logout } from "./actions/auth";
import { statsSetDesktopWidth } from "./actions/stats";
import battleMidlewareCreator from "./actions/middlewares/battle";

import App from "./App";

const store = createStore(
  reducer,
  composeWithDevTools({ maxAge: 20 })(
    applyMiddleware(thunk, battleMidlewareCreator())
  )
);
//const store = createStore(reducer, applyMiddleware(thunk));
const token = localStorage.user_jwt;

window.onresize = debounce(
  () => store.dispatch(statsSetDesktopWidth(window.innerWidth)),
  150
) as any;

Socket(token, store);

if (token) {
  setAuthHeader(token);
  api.user.user().then(({ error, data }) => {
    if (data) {
      store.dispatch(userAdd({ ...data, token }));
      renderApp();
    } else if (error) {
      console.error(error.message);
      logout()(store.dispatch);
      renderApp();
    } else {
      console.error("Server authentication doesn't work as expected");
      logout()(store.dispatch);
      renderApp();
    }
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
}
