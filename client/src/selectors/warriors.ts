import { createSelector } from "reselect";

export const myWarriorsSelector = createSelector(
  state => state.warriors,
  state => state.game,
  (warriors, game) => warriors[game.my_name]
);

export const opponentWarriorsSelector = createSelector(
  state => state.warriors,
  state => state.game,
  (warriors, game) => warriors[game.opponent_name]
);
