import { combineReducers } from "redux";

//import chat_messages from "./chat_messages";
import user from "./user";
import opponents from "./opponents";
import game from "./game";
import gamers from "./gamers";
import game_chat from "./game_chat";
import warriors from "./warriors";

export default combineReducers({
  user,
  opponents,
  game_chat,
  game,
  gamers,
  warriors
});

export {
  userAdd,
  userRemove,
  userIncreaseRate,
  userDecreaseRate
} from "./user";
export { warriorsAdd, warriorKicked, warriorsRelease } from "./warriors";
