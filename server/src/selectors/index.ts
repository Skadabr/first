import { createSelector } from "reselect";

export const currentPlayerSelector = (state, id) =>
  state.players.find(p => p.user._id === id);

export const opponentPlayerSelector = (state, id) =>
  state.players.find(p => p.user._id !== id);

export const nextTurnOwnerSelector = createSelector(
  getOpponentPlayer,
  player => player.user._id
);
