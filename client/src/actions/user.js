import setAuthHeader from "../utils/auth-header";
import IO from "../socket";
import { authApi, userApi } from "../api";

import { START_FIGHT, END_OF_FIGHT } from "./game.state";


export const PEACE = "PEACE";
export const READY = "READY";
export const FIGHT = "FIGHT";


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
    const token = await authApi.login(data);
    setAuthHeader(token);
    localStorage.user_jwt = token;
    const { name, email, status, money } = await userApi.user();
    IO(token);
    dispatch(createLogin({ name, email, token, money, status }));
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
    dispatch({ type: USER_UPDATE, payload: data });
  };
}

export function readyToFight() {
  return dispatch => {
    IO().gameIO.readyToFight();
  };
}

export function eliminateStatus() {
  return dispatch => {
    dispatch({ type: USER_UPDATE, payload: {last_fight_status: undefined} });
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

export function createLogin({ name, email, token, money, status = PEACE }) {
  return {
    type: USER_LOGIN,
    payload: { name, email, token, money, status }
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
