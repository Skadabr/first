import { combineReducers } from "redux";

import * as core from "core";

import chat, { ChatState } from "./actions/chat";
import ui, { UIState } from "./actions/ui";
import availableTargets from "./actions/targets";

const {
  userReducer: user,
  battleReducer: battle,
  usersReducer: users
} = core.state;

export default combineReducers({
  user,
  users,
  chat,
  ui,
  availableTargets,
  battle
});
