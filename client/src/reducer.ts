import { combineReducers } from "redux";

import user, { UserState } from "./actions/user";
import battle, { BattleState } from "./actions/battle";
import users, { UsersState } from "./actions/users";
import chat, { ChatState } from "./actions/chat";
import ui, { UIState } from "./actions/ui";
import availableTargets from "./actions/targets";

export default combineReducers({
  user,
  users,
  chat,
  ui,
  availableTargets,
  battle
});
