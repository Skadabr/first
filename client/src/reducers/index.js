import { combineReducers } from "redux";

import user from "./user";
import chat_messages from "./chat_messages";
import chat_users from "./chat_users";

export default combineReducers({ user, chat_messages, chat_users });
