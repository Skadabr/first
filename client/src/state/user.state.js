import decode from "jwt-decode";

import setAuthHeader from "../utils/auth-header";
import IO from "../socket";
import { authApi, userApi } from "../api";

export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";
export const USER_STATUS = "USER_STATUS";
export const USER_READY = "USER_READY";

export const PEACE = "peace";
export const READY = "ready";
export const FIGHT = "fight";

export default function(state = {}, { payload, type }) {
  switch (type) {
    case USER_LOGIN:
      return payload;
    case USER_LOGOUT:
      return {};
    case USER_STATUS:
      return { ...state, status: payload };

    default:
      return state;
  }
}

//
// ============ Actions ============
//

export function signup(data) {
  return () => {
    return userApi.signup(data);
  };
}

export function login(data) {
  return async dispatch => {
    let { name, email, token, status } = await authApi.login(data);
    localStorage.user_jwt = token;
    setAuthHeader(token);
    IO(token);
    dispatch(createLogin(name, email, token, status));
  };
}

export function logout(name) {
  return dispatch => {
    IO()();
    setAuthHeader();
    localStorage.removeItem("user_jwt");
    dispatch({ type: USER_LOGOUT });
  };
}

export function readyToFight() {
  return dispatch => {
    IO().gameIO.readyToFight();
    dispatch({ type: USER_STATUS, payload: READY });
  };
}

//
// ============ Action creators ============
//

export function createLogin(name, email, token, status = PEACE) {
  return {
    type: USER_LOGIN,
    payload: { name, email, token, status }
  };
}
