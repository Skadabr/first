import axios from "axios";

export default {
  login(data) {
    return axios
      .post("/api/auth/local", data)
      .then(r => r.data.data.token)
      .catch(toErrorMessage);
  }
};

function toErrorMessage(e) {
  if (e.response && e.response.data) {
    throw new Error(e.response.data.error.message);
  }
  throw e;
}
