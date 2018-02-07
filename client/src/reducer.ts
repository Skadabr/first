import { combineReducers } from "redux";

import user from "./actions/user";
import opponents from "./actions/opponents";
import game from "./actions/game";
import gamers from "./actions/gamers";
import game_chat from "./actions/game_chat";
import warriors from "./actions/warriors";

export default combineReducers({
  user,
  opponents,
  game_chat,
  game,
  gamers,
  warriors
});
