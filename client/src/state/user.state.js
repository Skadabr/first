import setAuthHeader from "../utils/auth-header";
import IO from "../socket";
import { authApi, userApi } from "../api";

import { START_FIGHT, END_OF_FIGHT } from "./game.state";


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
      return { ...state, ...payload };
    case START_FIGHT:
      return { ...state, status: FIGHT };
    case END_OF_FIGHT:
      return {
        ...state,
        status: PEACE,
        money: payload.money,
        last_fight_status: payload.status
      };

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
