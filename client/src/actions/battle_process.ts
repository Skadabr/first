import IO from "../socket";

import {
  state,
  selectors,
  unit,
  UserStatusType,
  UnitTypes,
  EffectScope,
  EffectImpact
} from "core";

//
// actions
//
const {
  userIncreaseRate,
  userDecreaseRate,
  userUpdateStatus,
  availableTargetsUpdate,
  unitAttack,
  playerAddCards,
  playerAddUnit,
  playerRemoveCard,
  playerDecreseMoney,
  unitActivate,
  unitDisActivate,
  unitDecreaseMoves,
  playerRemoveUnit,
  battleUpdate
} = state;
//
// selectors
//
const {
  getEffects,
  getUnit,
  getEnemyUnits,
  getNextTurnOwnerPlayer,
  getAllAvailableTargetIds,
  getDeadEnemyUnits,
  getRawUnitSource
} = selectors;
//
// lib
//
const { applyEffects } = unit;

//
// ============ Actions ============
//
export function createBattle(val, router) {
  return dispatch => {
    const { data, error } = val;
    // if (error) ????;

    dispatch(userUpdateStatus(UserStatusType.Fight));
    dispatch(battleUpdate(data));
    router.history.push("/user/battle");
  };
}

export function addUnit(card: any, position: number, player: any) {
  return dispatch => {
    const io = IO().gameIO;

    dispatch(playerRemoveCard(card));
    dispatch(playerDecreseMoney(player.user._id, card.unit.cost));
    dispatch(playerAddUnit(card.unit, position));

    io.addUnit(card._id, position, val => dispatch(battleUpdate(val)));
  };
}

export function onTurn() {
  return dispatch => {
    IO().gameIO.passTheTurn();
  };
}

export function activateUnit(unitId) {
  return (dispatch, getState) => {
    const state = getState();
    const targetIds = getAllAvailableTargetIds(unitId, state);
    dispatch(availableTargetsUpdate(targetIds));
  };
}

export function attack(data: { unitId: string; targetId: string }) {
  return (dispatch, getState) => {
    const { targetId, unitId } = data;

    const rawUnit = getRawUnitSource(unitId, targetId, getState());

    dispatch(unitAttack(targetId, rawUnit.attack));
    dispatch(unitDecreaseMoves(unitId, 1));

    const deadUnits = getDeadEnemyUnits(getState());

    deadUnits.forEach(unit => {
      dispatch(playerRemoveUnit(unit._id, unit.ownerId));
    });

    IO().gameIO.attack(data);
  };
}

export function disActivateUnit(unitId) {
  return (dispatch, getState) => {
    dispatch(availableTargetsUpdate([]));
  };
}

//
// ============ helpers ============
//
