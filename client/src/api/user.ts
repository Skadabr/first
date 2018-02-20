import axios from "axios";

export function user() {
  return axios.get("/api/user")
    .then(r => r.data)
    .catch(e => e.response.data);
}
