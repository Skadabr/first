import { combineReducers } from "redux";

import chat from "./actions/chat";
import ui from "./actions/ui";
import user from "./actions/user";
import users from "./actions/users";
import battle from "./actions/battle";
import availableTargets from "./actions/availableTargets"

export default combineReducers({
  user,
  users,
  battle,
  chat,
  ui,
  availableTargets
});
