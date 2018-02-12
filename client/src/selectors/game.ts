import { createSelector } from "reselect";

export const fightIsStartedSelector = createSelector(
  state => state.game,
  game => game.active
);

export const myTurnSelector = createSelector(
  state => state.game,
  game => game.turn
);

export const showChatSelector = createSelector(
  state => state.game,
  ({ active, show_chat }) => active && show_chat
);
