import { combineReducers } from "redux";

import chat, { ChatState } from "./actions/chat";
import ui, { UIState } from "./actions/ui";
import { state } from "core";

const {
  availableTargetsReducer,
  userReducer,
  usersReducer,
  battleReducer
} = state;

export default combineReducers({
  user: userReducer,
  users: usersReducer,
  battle: battleReducer,
  availableTargets: availableTargetsReducer,
  chat,
  ui
});
