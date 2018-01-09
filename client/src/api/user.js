import axios from "axios";

export default {
  signup(data) {
    return axios.post("/api/users", data).catch(toErrorMessage);
  }
}

function toErrorMessage(e) {
  if (e.response && e.response.data) {
    throw new Error(e.response.data.error.message);
  }
  throw e;
}
