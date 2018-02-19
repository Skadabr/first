import setAuthHeader from "../utils/auth-header";
import IO from "../socket";
import * as api from "../api";
import { userAdd } from "./user";
import { CLEAN_STATE } from "../constants";

export function signup(data) {
  return () => {
    return api.auth.signup(data);
  };
}

export function login(data) {
  return async dispatch => {
    const token = await api.auth.login(data);
    setAuthHeader(token);
    localStorage.user_jwt = token;
    const { name, email, status, rate } = await api.user.user();
    IO(token);
    dispatch(userAdd(name, email, token, rate, status));
  };
}

export function logout() {
  return dispatch => {
    IO()();
    setAuthHeader();
    localStorage.removeItem("user_jwt");
    dispatch({ type: CLEAN_STATE });
  };
}
