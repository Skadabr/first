import copy from "deep-copy";
import { createStore } from "redux";
import EventEmitter from "eventemitter3";

import * as card from "./card/index";
import * as unit from "./unit/index";
import * as actions from "./actions/index";
import * as selectors from "./selectors/index";
import * as validators from "./validators/index";
import * as Utils from "./utils";
import { getStateWithAppliedEffects } from "./selectors/battle";
import {getUniqueListOfTradeEffectTypes} from "./selectors/battle/effects";
import {getTradingFn} from "./unit/trade/index";
import {unitAddCounterEffects, unitSetHealth} from "./actions/battle/unit";

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

export enum EffectTargetingScope {
  Local,
  AllUnits,
  AllEnemyUnits,
  AllEnemyMinions,
  AllFriendlyUnits,
  AllFriendlyMinions,
  OtherFriendlyMinions
}

export enum EffectImpact {
  Availability,
  Attack,
  Health,
  Trade
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

  public playCard(cardId, position) {
    const state = this.state;

    const card = selectors.getCard(state, cardId);
    const player = selectors.getPlayer(state);

    const { error } = validators.validateAddUnitParams(card, player, position);

    if (error) {
      return this.emit(BATTLE_ERROR, error);
    }

    this.removeCard(cardId);
    this.decreaseMoney(player.user._id, card.unit.cost);
    this.addUnit(card.unit, position);
    this.applyBuffsBy(unit);
  }

  public attack(sourceId, targetId) {
    const state = getStateWithAppliedEffects(this.state);

    if (!selectors.isPlayerTurnOwner(state)) return;
    if (!selectors.isTargetAvailableForAttack(state, sourceId, targetId))
      return;

    this.trade(state, sourceId, targetId);

    //const deadUnits = selectors.getDeadEnemyUnits(state);
    // deadUnits.forEach(unit => {
    //   this.updatePuplicState(actions.playerRemoveUnit(unit._id, unit.ownerId));
    // });
  }

  private trade(state, sourceId, targetId) {
    const sourceTradeEffects = getUniqueListOfTradeEffectTypes(state, sourceId);
    const targetTradeEffects = getUniqueListOfTradeEffectTypes(state, targetId);

    const tradingFn = getTradingFn(sourceTradeEffects, targetTradeEffects);

    const {health, additionalCounterEffects} = tradingFn(state, sourceId, targetId);

    this.updatePrivateState(unitAddCounterEffects(targetId, additionalCounterEffect))
    this.updatePuplicState(unitSetHealth(targetId, additionalCounterEffects))
  }

  private applyBuffsBy(unit) {}

  private removeCard(cardId) {
    this.updatePuplicState(actions.playerRemoveCard(cardId));
  }

  private decreaseMoney(userId, cost) {
    this.updatePuplicState(actions.playerDecreseMoney(userId, cost));
  }

  private addUnit(unit, position) {
    this.updatePuplicState(actions.playerAddUnit(unit, position));
  }

  private updatePuplicState(action) {
    this.emit(BATTLE_EVENT, action);
    this.store.dispatch(action);
  }

  private updatePrivateState(action) {
    this.store.dispatch(action);
  }

  private get state() {
    return this.store.getState();
  }
}
