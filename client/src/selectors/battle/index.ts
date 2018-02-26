import { createSelector } from "reselect";
import { EffectScope, EffectImpact } from "../../constants";

export const battleSelector = state => state.battle;
export const playersSelector = state => state.battle.players;

export const isBattleStartedSelector = createSelector(
  battleSelector,
  battle => battle.players.length > 0
);

// ============ player ============

export const playerSelector = createSelector(
  playersSelector,
  state => state.user._id,
  (players, _id) => {
    const player = players.find(p => p.user._id === _id);
    return player;
  }
);

export const playerOpponentSelector = createSelector(
  playersSelector,
  state => state.user._id,
  (players, _id) => {
    const player = players.find(p => p.user._id !== _id);
    return player;
  }
);

//
// ============ turn ============

export const isTurnOwnerSelector = createSelector(
  battleSelector,
  state => state.user._id,
  (battle, _id) => battle.turnOwner === _id
);

export const nextTurnOwnerPlayerSelector = createSelector(
  battleSelector,
  battle => battle.players.find(p => p.user._id !== battle.turnOwner)
);

//
// ============ hero ============

export const playerHeroSelector = createSelector(
  playerSelector,
  player => player.hero
);

export const opponentHeroSelector = createSelector(
  playerOpponentSelector,
  player => player.hero
);

//
// ============ deck/card ============

export const playerDeckSelector = createSelector(
  playerSelector,
  player => player.deck
);

export const opponentDeckSelector = createSelector(
  playerOpponentSelector,
  player => player.deck
);

export const cardsSelector = createSelector(playersSelector, players =>
  players.reduce((sum, p) => [...p.deck, ...sum], [])
);

export const cardSelector = createSelector(
  cardsSelector,
  (c, id) => id,
  (cards, id) => cards.find(c => c._id === id)
);

//
// ============ units ============

export const unitsSelector = createSelector(playersSelector, players =>
  players.reduce((units, p) => [...units, ...p.units])
);

export const playerUnitsSelector = createSelector(
  playerSelector,
  player => player.units
);

export const opponentUnitsSelector = createSelector(
  playerOpponentSelector,
  player => player.units
);

//
// ============ effects ============

export const unitEffectsSelector = createSelector(unitsSelector, units =>
  units.map(units.effects)
);

export const playerUnitEffectsSelector = createSelector(
  playerUnitsSelector,
  units => units.map(units.effects)
);

export const opponentUnitEffectsSelector = createSelector(
  opponentUnitsSelector,
  units => units.map(units.effects)
);

export const globalPositionEffects = createSelector(unitEffectsSelector, effs =>
  effs.filter(
    ({ scope, impact }) =>
      scope === EffectScope.Global && impact === EffectImpact.Positions
  )
);

//
// ============ positions ============
//

export const targetPositionsSelector = createSelector(
  unitsSelector,
  playerUnitsSelector,
  opponentUnitsSelector,
  (units, playerUnits, opponentUnits) => {
    //
  }
);
