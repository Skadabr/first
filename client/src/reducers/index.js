import { combineReducers } from "redux";

import user from "./user";
import chat_messages from "./chat_messages";

export default combineReducers({ user, chat_messages });
