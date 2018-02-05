import axios from "axios";
import toErrorMessage from "../utils/to-error-message";

export function signup(data) {
  return axios.post("/api/users", data).catch(toErrorMessage);
}

export function login(data) {
  return axios
    .post("/api/auth/local", data)
    .then(r => r.data.data)
    .catch(toErrorMessage);
}
