import axios from "axios";
import toErrorMessage from "../utils/to-error-message";


export function user() {
  return axios("/api/user")
    .then(r => r.data.data)
    .catch(toErrorMessage);
}
