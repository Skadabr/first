import { combineReducers } from "redux";

//import chat_messages from "./chat_messages";
import user from "./user.state";
import opponents from "./opponents.state";
import game_chat from "./game_chat.state";
import game from "./game.state";

export default combineReducers({ user, opponents, game_chat, game });
