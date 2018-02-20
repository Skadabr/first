import { combineReducers } from "redux";

import user, { UserState } from "./actions/user";
import battle, { BattleState } from "./actions/battle";
import users, { UsersState } from "./actions/users";
import chat, { ChatState } from "./actions/chat";
import ui, { UIState } from "./actions/ui";

export default combineReducers({
  user,
  users,
  chat,
  ui,
  battle
});

export interface State {
  user: UserState;
  users: UsersState;
  chat: ChatState;
  ui: UIState;
}
