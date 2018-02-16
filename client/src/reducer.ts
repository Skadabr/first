import { combineReducers } from "redux";

import user, { UserState } from "./actions/user";
import opponents, { OpponentsState } from "./actions/opponents";
import game_chat, { GameChatState } from "./actions/game_chat";
import stats, { StatsState } from "./actions/stats";

export default combineReducers({
  user,
  opponents,
  game_chat,
  stats
});

export interface State {
  user: UserState;
  opponents: OpponentsState;
  game_chat: GameChatState;
  stats: StatsState;
}
