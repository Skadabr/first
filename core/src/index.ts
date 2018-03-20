import copy from "deep-copy";
import { createStore } from "redux";
import EventEmitter from "eventemitter3";

import * as card from "./card/index";
import * as unit from "./unit/index";
import * as actions from "./actions/index";
import * as selectors from "./selectors/index";
import * as validators from "./validators/index";
import * as Utils from "./utils";

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

export const utils = Utils;

export function createBattle() {}

const BATTLE_EVENT = "event";
const BATTLE_ERROR = "error";

export class Battle extends EventEmitter {
  private store: any;

  constructor(battle, user) {
    super();
    battle = copy(battle);
    user = copy(user);
    this.store = createStore(actions.reducer, { battle, user });
  }

  public toJSON() {
    const { turnOwner, players } = this.store.getState();
    return {
      turnOwner,
      players: copy(players)
    };
  }

  //
  // NOTE: bad name ???
  //
  public playCard(card_id, position) {
    const state = this.state;

    const card = selectors.getCard(state, card_id);
    const player = selectors.getPlayer(state);

    const { error } = validators.validateAddUnitParams(card, player, position);

    if (error) {
      return this.emit(BATTLE_ERROR, error);
    }

    this.removeCard(card_id);
    this.decreaseMoney(player.user._id, card.unit.cost);
    this.addUnit(card.unit, position);
    this.applyBuffsBy(unit);
  }

  public attack({ unit_id, target_id }) {
    const state = this.state;
    if (!selectors.isPlayerTurnOwner(state)) return;
    if (!selectors.isTargetAvailableForAttack(state, unit_id, target_id))
      return;

    const rawUnit = selectors.getRawUnitSource(state, unit_id, target_id);

    this.updatePuplicState(actions.unitDecreaseHealth(target_id, rawUnit.damage));
    this.updatePuplicState(actions.unitDecreaseMoves(unit_id, 1));

    const deadUnits = selectors.getDeadOpponentUnits(state);

    deadUnits.forEach(unit => {
      this.updatePuplicState(actions.playerRemoveUnit(unit._id, unit.owner_id));
    });
  }

  private applyBuffsBy(unit) {}

  private removeCard(card_id) {
    this.updatePuplicState(actions.playerRemoveCard(card_id));
  }

  private decreaseMoney(user_id, cost) {
    this.updatePuplicState(actions.playerDecreseMoney(user_id, cost));
  }

  private addUnit(unit, position) {
    this.updatePuplicState(actions.playerAddUnit(unit, position));
  }


  private get state() {
    return this.store.getState();
  }

  private updatePuplicState(action) {
    this.emit(BATTLE_EVENT, action);
    this.store.dispatch(action);
  }

  private updatePrivateState(action) {
    this.store.dispatch(action);
  }
}
