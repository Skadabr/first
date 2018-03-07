import setAuthHeader from "../utils/auth-header";
import IO from "../socket";
import * as api from "../api";
import * as core from "core";

const { userAdd } = core.state;
const { CLEAN_STATE } = core.constants;

export function signup(val) {
  return () => {
    return api.auth.signup(val);
  };
}

export function login(creadentials) {
  return async dispatch => {
    const { error, data: token } = await api.auth.login(creadentials);

    if (error) return { error };

    setAuthHeader(token);
    localStorage.user_jwt = token;

    const resp = await api.user.user();

    if (resp.data) {
      IO(token);
      dispatch(userAdd({ ...resp.data, token }));
    }

    return resp;
  };
}

export function logout() {
  return dispatch => {
    const io = IO();
    io && io();
    setAuthHeader();
    localStorage.removeItem("user_jwt");
    dispatch({ type: CLEAN_STATE });
  };
}
