import { createSelector } from "reselect";

import { GameStatus} from "../actions/game";

export const fightIsStartedSelector = createSelector(
  state => state.game,
  game => game.status !== GameStatus.None
);

export const myTurnSelector = createSelector(
  state => state.game,
  game => game.turn
);

export const showChatSelector = createSelector(
  state => state.game,
  ({ status, show_chat }) => status !== GameStatus.None && show_chat
);

export const gameStatusSelector = createSelector(
  state => state.game,
  game => game.status
);

