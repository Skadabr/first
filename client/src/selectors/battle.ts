import { createSelector } from "reselect";

export const myUserSelector = createSelector(
  state => state.battle,
  state => state.user.name,
  (battle, name) => {
    return battle.users.find(u => u.user.name === name);
  }
);

export const opponentUserSelector = createSelector(
  state => state.battle,
  state => state.user.name,
  (battle, name) => {
    return battle.users.find(u => u.user.name !== name);
  }
);

export const myTurnSelector = createSelector(
  state => state.battle,
  state => state.user.name,
  (battle, name) => battle.turnOwner  === name
);

// export const opponentGamerSelector = createSelector(
//   state => state.gamers,
//   state => state.game,
//   (gamers, game) => gamers[game.opponent_name]
// );
