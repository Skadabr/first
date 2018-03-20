import { UserStatusType } from "../../../core/src/index";
import { UserState } from "../actions/user";

export const getUserInfo = state => {
  const { _id, name, status, email, rate } = state.user;
  return { _id, name, status, email, rate }
}

export const isAuthenticated = state => !!state.user.token
