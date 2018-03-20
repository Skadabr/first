import { combineReducers } from "redux";

import chat, { ChatState } from "./actions/chat";
import ui, { UIState } from "./actions/ui";
import user from "./actions/user";
import users from "./actions/users";
import { state } from "core";

const {
  availableTargetsReducer,
  battleReducer
} = state;

export default combineReducers({
  user,
  users,
  battle: battleReducer,
  availableTargets: availableTargetsReducer,
  chat,
  ui
});
