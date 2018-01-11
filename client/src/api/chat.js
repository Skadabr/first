import axios from "axios";
import toErrorMessage from "../utils/to-error-message";

export default {
  loadMessages() {
    return axios("/api/messages", {params: {amount: 10}})
      .then(r => r.data.data)
      .catch(toErrorMessage);
  },

  loadChatUsers() {
    return axios("/api/chat_users")
      .then(r => r.data.data)
      .catch(toErrorMessage);
  }
};
