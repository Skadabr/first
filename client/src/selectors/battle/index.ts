import { createSelector } from "reselect";
import { Impact } from "../../constants";

export const battleSelector = state => state.battle;
export const playersSelector = state => state.battle.players;

export const isBattleStartedSelector = state => {
  battleSelector(state).players.length > 0;
};

//
// ============ player ============

export const playerSelector = state => {
  const players = playerSelector(state);
  const _id = state.user._id;
  return players.find(p => p.user_id === _id);
};

export const playerOpponentSelector = state => {
  const players = playerSelector(state);
  const _id = state.user._id;
  return players.find(p => p.user_id !== _id);
};

//
// ============ turn ============

export const isTurnOwnerSelector = state => {
  const battle = battleSelector(state);
  const _id = state.user._id;
  return battle.turnOwner === _id;
};

export const nextTurnOwnerPlayerSelector = state => {
  const battle = battleSelector(state);
  return battle.players.find(p => p.user._id !== battle.turnOwner);
};

//
// ============ hero ============

export const playerHeroSelector = state => playerSelector(state).hero;

export const playerOpponentHeroSelector = state =>
  playerOpponentSelector(state).hero;

//
// ============ hand/card ============

export const playerHandSelector = state => playerSelector(state).hand;

export const playerOpponentHandSelector = state =>
  playerOpponentSelector(state).hand;

export const cardsSelector = state =>
  playersSelector(state).reduce((sum, p) => [...p.hand, ...sum], []);

export const cardSelector = (state, id) =>
  cardsSelector(state).find(c => c._id === id);

//
// ============ units ============

export const unitsSelector = state =>
  playersSelector(state).reduce((units, p) => [...units, ...p.units]);

export const unitSelector = (state, id) =>
{
  const unit = unitsSelector(state).find(unit => unit._id === id);
}

//
// ============ effects ============

export const effectsSelector = state =>
  unitsSelector(state).map(u => u.effects);

export const featuresSelector = state =>
  unitsSelector(state).map(u => u.features);

//
// ============ positions ============
//

export const targetsSelector = (state, unit, targetUnit) => {
  const features = featuresSelector(state);

  applyFeatures(features, unit, target);
};
