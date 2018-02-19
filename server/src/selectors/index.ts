import { createSelector } from "reselect";

export const playerSelector = createSelector<any, any, any, any>(
  state => state.battle.players,
  state => state.user._id,
  (players, _id) => {
    return players.find(p => p.user._id === _id);
  }
);

export const playerOpponentSelector = createSelector<any, any, any, any>(
  state => state.battle.players,
  state => state.user._id,
  (players, _id) => {
    return players.find(p => p.user._id !== _id);
  }
);

export const isTurnOwnerSelector = createSelector<any, any, any, any>(
  state => state.battle,
  state => state.user._id,
  (battle, _id) => battle.turnOwner === _id
);

export const nextTurnOwnerSelector = createSelector<any, any, any>(
  state => state.battle,
  battle => battle.players.find(p => p.user._id !== battle.turnOwner)
);
