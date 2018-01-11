import { combineReducers } from "redux";

//import chat_messages from "./chat_messages";
import user from "./user";
import opponents from "./opponents";

export default combineReducers({ user, opponents });
