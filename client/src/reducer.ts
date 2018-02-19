import { combineReducers } from "redux";

import user, { UserState } from "./actions/user";
import battle, { BattleState } from "./actions/battle";
import opponents, { OpponentsState } from "./actions/opponents";
import chat, { ChatState } from "./actions/chat";
import ui, { UIState } from "./actions/ui";

export default combineReducers({
  user,
  opponents,
  chat,
  ui,
  battle
});

export interface State {
  user: UserState;
  opponents: OpponentsState;
  chat: ChatState;
  ui: UIState;
}
