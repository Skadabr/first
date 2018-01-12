import { combineReducers } from "redux";

//import chat_messages from "./chat_messages";
import user from "./user.state";
import opponents from "./opponents.state";

export default combineReducers({ user, opponents });
