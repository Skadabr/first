import { combineReducers } from "redux";

import user, { UserState } from "./actions/user";
import opponents, { OpponentsState } from "./actions/opponents";
import game, { GameState } from "./actions/game";
import gamers, { GamersState } from "./actions/gamers";
import game_chat, { GameChatState } from "./actions/game_chat";
import warriors, { WarriorsState } from "./actions/warriors";
import stats, { StatsState } from "./actions/stats";

export default combineReducers({
  user,
  opponents,
  game_chat,
  game,
  gamers,
  warriors,
  stats
});

export interface State {
  user: UserState;
  opponents: OpponentsState;
  game_chat: GameChatState;
  game: GameState;
  gamers: GamersState;
  warriors: WarriorsState;
  stats: StatsState;
}
