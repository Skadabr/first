import dcopy from "deep-copy";
import { createStore, applyMiddleware } from "redux";
import reduxLogger from "redux-logger";
import EventEmitter from "eventemitter3";

import { getTradingFn } from "../unit/trade/index";

import { getUniqueListOfTradeEffectTypes } from "../selectors/battle/effects";
import { getUnitHealthWithAppliedEffects } from "../selectors/battle/unit";
import {
  getEnemyUnitIds,
  getPlayerUnitIds,
  getUnitAttackWithAppliedEffects,
  getUnitById,
  isTargetAvailableForAttack
} from "../selectors";
import {getDeadUnitsIds, isUnitExist} from "../selectors/battle/units";
import {
  getCard,
  getPlayer,
  getTurnOwnerId,
  isPlayerTurnOwner
} from "../selectors/battle";

import {
  playerAddUnit,
  playerDecreseMoney,
  playerRemoveCard, reducer, unitSetMoves
} from "../actions";
import { unitAddCounterEffects, unitSetHealth } from "../actions/battle/unit";
import { unitsRemove } from "../actions/battle/units";

import { validateAddUnitParams } from "../validators/battle";
import { battleNextTurn } from "../actions/battle";

export class BattleEngine extends EventEmitter {
  static BATTLE_EVENT = "event";
  static BATTLE_ERROR = "error";

  private store: any;

  constructor(battle, user) {
    super();
    battle = dcopy(battle);
    user = dcopy(user);
    this.store = createStore(
      reducer,
      {
        battle,
        user
      }
      //applyMiddleware(reduxLogger)
    );
  }

  public toJSON() {
    return dcopy(this.state.battle);
  }

  // public createDeck(userId: string, opponentId: string) {
  //   // let cards: any[] = (await new Promise(ok =>
  //   //   this.ws.emit(SELECT_CARDS_FOR_DECK, createRandomCards(DECK_INIT_SIZE), ok)
  //   // )) as any;
  //   // if (cards.length < DECK_INIT_SIZE) {
  //   //   cards = [...cards, ...createRandomCards(DECK_INIT_SIZE - cards.length)];
  //   // }
  //   // store.dispatch(playerAddCards(cards));
  //   this.updateState(
  //     playerAddCards(userId, createRandomCards(3, userId))
  //   );
  //   this.updateState(
  //     playerAddCards(opponentId, createRandomCards(3, opponentId))
  //   );
  // }

  public playCard(cardId: string, position: number) {
    const state = this.state;

    if (!isPlayerTurnOwner(state)) return;

    const card = getCard(state, cardId);
    const player = getPlayer(state);

    const { error } = validateAddUnitParams(card, player, position);

    if (error) this.emit(BattleEngine.BATTLE_ERROR, error);

    this.removeCard(cardId);
    this.decreaseMoney(player.user._id, card.unit.cost);
    this.addUnit(card.unit, position);
  }

  public nextTurn() {
    const state = this.state;

    if (!isPlayerTurnOwner(state)) return;

    getPlayerUnitIds(state).forEach(unitId => {
      this.updateState(unitSetMoves(unitId, 0));
    });
    getEnemyUnitIds(state).forEach(unitId => {
      this.updateState(unitSetMoves(unitId, 1));
    });
    this.updateState(battleNextTurn());

    this.emit(BattleEngine.BATTLE_EVENT, battleNextTurn());
  }

  public attack(sourceId: string, targetId: string) {
    const state = this.state;

    if (!isPlayerTurnOwner(state)) return;
    if (!isUnitExist(state, sourceId) || !isUnitExist(state, targetId)) return;
    if (!isTargetAvailableForAttack(state, sourceId, targetId)) return;

    this.trade(sourceId, targetId);
    this.removeDeadUnits();
  }

  public getUnitState(unitId) {
    const state = this.state;
    const unit = getUnitById(state, unitId);

    if (!unit) return;

    const health = getUnitHealthWithAppliedEffects(state, unitId);
    const attack = getUnitAttackWithAppliedEffects(state, unitId);
    return {
      _id: unit._id,
      type: unit.type,
      cost: unit.cost,
      moves: unit.moves,
      effects: unit.effects,
      health,
      attack
    };
  }

  private trade(sourceId, targetId) {
    const state = this.state;
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

    const finalHealth = getUnitHealthWithAppliedEffects(this.state, targetId);
    this.emit(BattleEngine.BATTLE_EVENT, unitSetHealth(targetId, finalHealth));
  }

  private removeDeadUnits() {
    const deadUnitIds = getDeadUnitsIds(this.state);
    for (const id of deadUnitIds) {
      this.updateState(unitsRemove(id));
      this.emit(BattleEngine.BATTLE_EVENT, unitsRemove(id));
    }
  }

  //
  // ===== private =====
  //

  private removeCard(cardId) {
    const action = playerRemoveCard(cardId);
    this.updateState(action);
    this.emit(BattleEngine.BATTLE_EVENT, action);
  }

  private decreaseMoney(userId, cost) {
    const action = playerDecreseMoney(userId, cost);
    this.updateState(action);
    this.emit(BattleEngine.BATTLE_EVENT, action);
  }

  private addUnit(unit, position) {
    const action = playerAddUnit(unit, position);
    this.updateState(action);
    this.emit(BattleEngine.BATTLE_EVENT, action);
  }

  private updateState(action) {
    this.store.dispatch(action);
  }

  private get state() {
    return this.store.getState();
  }
}
