import axios from "axios";
import toErrorMessage from "../utils/to-error-message";

export const userApi = {
  signup(data) {
    return axios.post("/api/users", data).catch(toErrorMessage);
  },

  user() {
    return axios("/api/user")
      .then(r => r.data.data)
      .catch(toErrorMessage);
  }
};
