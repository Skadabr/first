import decode from "jwt-decode";

import setAuthHeader from "../utils/auth-header";
import authApi from "../api/auth.js";
import { USER_LOGIN, USER_LOGOUT } from "../constants";

export function login(data) {
  return async dispatch => {
    let token = await authApi.login(data);
    const { name, email } = decode(token);
    localStorage.user_jwt = token;
    setAuthHeader(token);
    const user = { name, email, token };
    dispatch({
      type: USER_LOGIN,
      user
    });
  };
}

export function logout() {
  return dispatch => {
    setAuthHeader();
    localStorage.removeItem('user_jwt');
    dispatch({type: USER_LOGOUT});
  }
}
