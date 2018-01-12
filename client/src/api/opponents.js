import axios from "axios";
import toErrorMessage from "../utils/to-error-message";

export const opponentsApi = {
  //loadMessages() {
  //  return axios("/api/messages", {params: {amount: 10}})
  //    .then(r => r.data.data)
  //    .catch(toErrorMessage);
  //},

  loadOpponents(name) {
    return axios("/api/users")
      .then(r => r.data.data.filter(n => n !== name))
      .catch(toErrorMessage);
  }
};
