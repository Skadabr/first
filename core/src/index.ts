import copy from "deep-copy";
import { createStore } from "redux";
import EventEmitter from "eventemitter3";

import * as actions from "./actions/index";
import * as selectors from "./selectors/index";
import * as validators from "./validators/index";
import * as Utils from "./utils";
import { getUniqueListOfTradeEffectTypes } from "./selectors/battle/effects";
import { getTradingFn } from "./unit/trade/index";
import { unitAddCounterEffects, unitSetHealth } from "./actions/battle/unit";
import { getUnitHealthWithAppliedEffects } from "./selectors/battle/unit";
import { playerAddUnit, playerDecreseMoney, playerRemoveCard } from "./actions";

export enum UserStatusType {
  Peace = "PEACE",
  Ready = "READY",
  Fight = "FIGHT"
}
export enum UnitTypes {
  Pawn = "PAWN",
  Officer = "OFFICER",
  Horse = "HORSE"
}
export enum GameStatus {
  None,
  Active,
  Win,
  Lose,
  Broken
}

export enum EffectTypes {
  Health = "HEALTH",
  Attack = "ATTACK",
  Taunt = "TAUNT",
  UnTaunt = "UNTAUNT",
}

export enum EffectTargetingScope {
  Local = "LOCAL",
  AllUnits = "ALL_UNITS",
  AllEnemyUnits = "ALL_ENEMY_UNITS",
  AllEnemyMinions = "ALL_ENEMY_MINIONS",
  AllFriendlyUnits = "ALL_FRIENDLY_UNITS",
  AllFriendlyMinions = "ALL_FRIENDLY_MINIONS",
  OtherFriendlyMinions = "OTHER_FRIENDLY_MINIONS"
}

export enum EffectImpact {
  Availability = "AVAILABILITY",
  Attack = "ATTACK",
  Health = "HEALTH",
  Trade = "TRADE"
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
  }

  public attack(sourceId, targetId) {
    const state = this.state;

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

    const { health, additionalCounterEffects } = tradingFn(
      state,
      sourceId,
      targetId
    );

    this.updateState(unitAddCounterEffects(targetId, additionalCounterEffects));
    this.updateState(unitSetHealth(targetId, health));

    const finalHealth = getUnitHealthWithAppliedEffects(state, targetId);
    this.emit(BATTLE_EVENT, unitSetHealth(targetId, finalHealth));
  }

  //
  // ===== private =====
  //

  private removeCard(cardId) {
    const action = playerRemoveCard(cardId);
    this.updateState(action);
    this.emit(BATTLE_EVENT, action);
  }

  private decreaseMoney(userId, cost) {
    const action = playerDecreseMoney(userId, cost);
    this.updateState(action);
    this.emit(BATTLE_EVENT, action);
  }

  private addUnit(unit, position) {
    const action = playerAddUnit(unit, position);
    this.updateState(action);
    this.emit(BATTLE_EVENT, action);
  }

  private updateState(action) {
    this.store.dispatch(action);
  }

  private get state() {
    return this.store.getState();
  }
}
