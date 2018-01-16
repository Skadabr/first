import setAuthHeader from "../utils/auth-header";
import IO from "../socket";
import { authApi, userApi } from "../api";

import { START_FIGHT } from "./game.state";

export const USER_LOGIN = "USER_LOGIN";
export const USER_LOGOUT = "USER_LOGOUT";
export const USER_UPDATE = "USER_UPDATE";
export const USER_READY = "USER_READY";

export const PEACE = "PEACE";
export const READY = "READY";
export const FIGHT = "FIGHT";

export default function(state = {}, { payload, type }) {
  switch (type) {
    case USER_LOGIN:
      return payload;
    case USER_LOGOUT:
      return {};
    case USER_UPDATE:
      return {...state, ...payload}
    case START_FIGHT:
      return { ...state, status: FIGHT };

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

export function update(data) {
  return dispatch => {
    dispatch({type: USER_UPDATE, payload: data});
  }
} 

export function readyToFight() {
  return dispatch => {
    IO().gameIO.readyToFight();
  };
}

//({ status, opponent_socket_id }) => {
//      if (status === READY) {
//        dispatch({ type: USER_STATUS, payload: READY });
//      } else {
//        dispatch(createStartFight(opponent_socket_id));
//      }
//    }

//
// ============ Action creators ============
//

export function createLogin(name, email, token, status = PEACE) {
  return {
    type: USER_LOGIN,
    payload: { name, email, token, status }
  };
}

function createStartFight(opponent_socket_id) {
  return {
    type: START_FIGHT,
    payload: {
      opponent_socket_id
    }
  };
}
