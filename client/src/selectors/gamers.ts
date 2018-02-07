import { createSelector } from "reselect";

export const myGamerSelector = createSelector(
  state => state.gamers,
  state => state.game,
  (gamers, game) => gamers[game.my_name]
);

export const opponentGamerSelector = createSelector(
  state => state.gamers,
  state => state.game,
  (gamers, game) => gamers[game.opponent_name]
);
