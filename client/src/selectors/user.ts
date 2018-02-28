import { UserStatusType } from "../constants";
import { State } from "../reducer";
import { UserState } from "../actions/user";

export const getUserInfo = state => {
  const { name, status, email, rate } = state.user;
  return { name, status, email, rate }
}

export const isAuthenticated = state => !!state.user.token
