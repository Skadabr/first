import decode from "jwt-decode";

import setAuthHeader from "../utils/auth-header";
import authApi from "../api/auth.js";

export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";
export const USER_ONLINE = "USER_ONLINE";
export const USER_OFFLINE = "USER_OFFLINE";

export default function(state = {}, action) {
  switch (action.type) {
    case USER_LOGIN:
      return action.user;
    case USER_LOGOUT:
      return {};
    case USER_ONLINE:
      return { ...state, online: true };
    case USER_OFFLINE:
      return { ...state, online: false };

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
    dispatch(createLogin(name, email, token));
    
  };
}

export function logout() {
  return dispatch => {
    setAuthHeader();
    localStorage.removeItem("user_jwt");
    dispatch({ type: USER_LOGOUT });
  };
}

export function createLogin(name, email, token) {
  return {
    type: USER_LOGIN,
    payload: { name, email, token }
  };
}
