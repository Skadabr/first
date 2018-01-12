import decode from "jwt-decode";

import setAuthHeader from "../utils/auth-header";
import IO from "../socket";
import { authApi, userApi } from "../api";

export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";

export default function(state = {}, {payload, type}) {
  switch (type) {
    case USER_LOGIN:
      return payload;
    case USER_LOGOUT:
      return {};

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
    IO().opponentsIO.add(name);
    dispatch(createLogin(name, email, token));
  };
}

export function logout(name) {
  return dispatch => {
    setAuthHeader();
    localStorage.removeItem("user_jwt");
    IO().opponentsIO.remove(name);
    dispatch({ type: USER_LOGOUT });
  };
}

//
// ============ Action creators ============
//

export function createLogin(name, email, token) {
  return {
    type: USER_LOGIN,
    payload: { name, email, token }
  };
}
