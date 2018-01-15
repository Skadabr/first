import decode from "jwt-decode";

import setAuthHeader from "../utils/auth-header";
import IO from "../socket";
import { authApi, userApi } from "../api";

export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";
export const USER_ACTIVE = "USER_ACTIVE";
export const USER_NONACTIVE = "USER_NONACTIVE";

export default function(state = {}, { payload, type }) {
  switch (type) {
    case USER_LOGIN:
      return payload;
    case USER_LOGOUT:
      return {};
    case USER_ACTIVE:
      return { ...state, active: true };
    case USER_NONACTIVE:
      return { ...state, active: false };

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
    let token = await authApi.login(data);
    const { name, email } = decode(token);
    localStorage.user_jwt = token;
    setAuthHeader(token);
    IO(token);
    dispatch(createLogin(name, email, token));
  };
}

export function logout(name) {
  return dispatch => {
    const io = IO();
    io();
    setAuthHeader();
    localStorage.removeItem("user_jwt");
    dispatch({ type: USER_LOGOUT });
  };
}

export function beActive(name) {
  return dispatch => {
    IO().opponentsIO.add(name);
    dispatch({ type: USER_ACTIVE });
  };
}

export function beNonActive(name) {
  return dispatch => {
    IO().opponentsIO.remove(name);
    dispatch({ type: USER_NONACTIVE });
  };
}

//
// ============ Action creators ============
//

export function createLogin(name, email, token, active = true) {
  return {
    type: USER_LOGIN,
    payload: { name, email, token, active }
  };
}
