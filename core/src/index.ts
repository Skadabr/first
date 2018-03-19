import copy from "deep-copy";
import { createStore } from "redux";
import EventEmitter from "eventemitter3";

import * as card from "./card/index";
import * as unit from "./unit/index";
import * as state from "./state/index";
import * as selectors from "./selectors/index";
import * as validators from "./validators/index";
import { isTargetAvailableForAttack } from "./selectors/battle";

export { battleReducer } from "./state/index";

export enum UserStatusType {
  Peace,
  Ready,
  Fight
}
export enum UnitTypes {
  Pawn,
  Officer,
  Horse
}
export enum GameStatus {
  None,
  Active,
  Win,
  Lose,
  Broken
}
export enum EffectScope {
  Global,
  Local
}
export enum EffectImpact {
  Availability,
  Attack,
  Defend,
  Move,
  Selection
}

export const POSITIONS = 13;
export const MAX_UNITS_ON_FIELD = 7;
export const MIDDLE_POSITION = (POSITIONS / 2) | 0;

export const CLEAN_STATE = "CLEAN_STATE";

export function createBattleWithStore(store) {
  return new Battle(store);
}

export function createBattle(battle, user) {
  battle = copy(battle);
  user = copy(user);
  const store = createStore(state.reducer, { battle, user });

  return new Battle(store);
}

export const TAKE_CARD = "TAKE_CARD";

class Battle extends EventEmitter {
  private store: any;

  constructor() {
    this.store = store;
  }

  public toJSON() {
    const { turnOwner, players } = this.store.getState();
    return {
      turnOwner,
      players: copy(players)
    };
  }

  getAvailableTargetsByAttacker;
  applyGlobalFeatures;

  public addUnit(card_id) {
    const { getState, dispatch } = this.store;

    const card = selectors.getCard(getState(), card_id);
    const player = selectors.getPlayer(getState());

    const { error } = validators.validateAddUnitParams(card, player, position);
    return error;

    this.emit(state.playerRemoveCard(card_id));
    this.emit(state.playerDecreseMoney(player.user._id, card.unit.cost));
    this.emit(state.playerAddUnit(card.unit, position));
    // dispatch(state.playerRemoveCard(card_id));
    // dispatch(state.playerDecreseMoney(player.user._id, card.unit.cost));
    // dispatch(state.playerAddUnit(card.unit, position));
  }

  public attack({ unit_id, target_id }) {
    const { dispatch, getState } = this.store;

    if (!selectors.isCurrentUserTurnOwner(getState())) return;
    if (!selectors.isTargetAvailableForAttack(state, unit_id, target_id))
      return;

    const rawUnit = selectors.getRawUnitSource(state, unit_id, target_id);

    dispatch(state.unitAttack(target_id, rawUnit.damage));
    dispatch(state.unitDecreaseMoves(unit_id, 1));

    const deadUnits = selectors.getDeadOpponentUnits(getState());

    deadUnits.forEach(unit => {
      dispatch(state.playerRemoveUnit(unit._id, unit.owner_id));
    });
  }
}
