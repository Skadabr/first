import axios from "axios";

export function signup(data) {
  return axios.post("/api/users", data).catch(e => e.response.data);
}

export function login(data) {
  return axios
    .post("/api/auth/local", data)
    .then(r => r.data)
    .catch(e => e.response.data);
}
