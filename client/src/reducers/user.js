import { USER_LOGIN, USER_LOGOUT } from "../constants";

export default function (state = {}, action) {
  switch(action.type) {
    case USER_LOGIN:
      return action.user;
    case USER_LOGOUT:
      return {};
    default: return state;
  }
}
