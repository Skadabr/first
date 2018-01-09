import userApi from "../api/user.js";

export function signup(data) {
  return dispatch => {
    return userApi.signup(data);
  };
}
