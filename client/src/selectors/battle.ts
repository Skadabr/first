import { createSelector } from "reselect";

export const playerSelector = createSelector(
  state => state.battle.players,
  state => state.user._id,
  (players, _id) => {
    return players.find(p => p.user._id === _id);
  }
);

export const playerOpponentSelector = createSelector(
  state => state.battle.players,
  state => state.user._id,
  (players, _id) => {
    return players.find(p => p.user._id !== _id);
  }
);

export const isTurnOwnerSelector = createSelector(
  state => state.battle,
  state => state.user._id,
  (battle, _id) => battle.turnOwner === _id
);

export const battleIsStartedSelector = createSelector(
  state => state.battle,
  battle => battle.players
);
