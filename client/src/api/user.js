import axios from "axios";
import toErrorMessage from "../utils/to-error-message";

export default {
  signup(data) {
    return axios.post("/api/users", data).catch(toErrorMessage);
  }
}
