import bind from "bind-decorator";

import { log } from "../../logger";
import {
  _newBattleLog,
  _setUserReadyLog
} from "../../logger/controllers/battle";
import {Battle, validators} from "core";

import {
  USERS_UPSERT,
  USER_UPDATE_STATUS,
  BATTLE_REQUEST,
} from "../game";

const { validateAddUnitParams } = validators;
//
// ============ controller ============
//

export default class BattleController {
  private ws: any;
  private Battle: any;
  private User: any;

  constructor(ws, { models }) {
    this.ws = ws;
    this.Battle = models.model("Battle");
    this.User = models.model("User");
  }

  //
  // ============ tryCreateBattle ============
  //

  @bind
  public async tryCreateBattle() {
    const { ws, User } = this;
    const opponent = await User.acquireEnemy(ws.user);

    if (!opponent) {
      await this._setUserReady(ws.user);
      return;
    }

    const battleCollection = await this._newBattle(ws.user, opponent);
    const battleJSON = battleCollection.toJSON();
    const battle = new Battle(battleJSON.battle, ws.user.toJSON());

    await this._createDeck(ws.user._id, opponent._id, store);

    battleCollection.updateState(battle.toJSON().battle);

    this._send(BATTLE_REQUEST, opponent.socketId, {
      data: battle.toJSON().battle
    });
  }

  //
  // ============ addTestUnit ============
  //

  public addUnit = async ({ cardId, position }, cb) => {
    const { store, battle, opponent } = this.ws;

    const card = getCard(store.getState(), cardId);
    const player = getPlayer(store.getState());

    const { error } = validateAddUnitParams(card, player, position);
    if (error) return cb({ error });

    store.dispatch(playerRemoveCard(card));
    store.dispatch(playerDecreseMoney(player.user._id, card.unit.cost));
    store.dispatch(playerAddUnit(card.unit, position));

    battle.updateState(store.getState().battle);

    this._send(BATTLE_REQUEST, opponent.socketId, { data: battle.toJSON() });
  };

  //
  // ============ passTheTurn ============
  //

  public passTheTurn = async () => {
    const { store, battle, opponent } = this.ws;
    let state = store.getState();

    const turnOwner = getTurnOwner(state);

    if (!isCurrentUserTurnOwner(state)) return;

    getPlayerUnitIds(store.getState()).forEach(unitId => {
      store.dispatch(unitSetMoves(unitId, 0));
      store.dispatch(unitSetAvailability(unitId, 1));
    });
    getEnemyUnitIds(store.getState()).forEach(unitId => {
      store.dispatch(unitSetMoves(unitId, 1));
      store.dispatch(unitSetAvailability(unitId, 0));
    });
    store.dispatch(playerAdjustMoney(turnOwner));
    store.dispatch(battleNextTurn());

    battle.updateState(store.getState().battle);
    this._send(BATTLE_REQUEST, opponent.socketId, { data: battle.toJSON() });
  };

  //
  // ============ attack ============
  //

  public attack = async ({ unitId, targetId }) => {
    const { store, battle, opponent } = this.ws;
    const { dispatch, getState } = store;
    const state = getState();

    const turnOwner = getTurnOwner(state);
    if (!isCurrentUserTurnOwner(state)) return;

    const targetIds = getAllAvailableTargetIds(unitId, state);

    if (!targetIds.includes(targetId)) return;

    const rawUnit = getRawUnitSource(unitId, targetId, state);

    dispatch(unitAttack(targetId, rawUnit.attack));
    dispatch(unitDecreaseMoves(unitId, 1));

    const deadUnits = getDeadEnemyUnits(getState());

    deadUnits.forEach(unit => {
      dispatch(playerRemoveUnit(unit._id, unit.ownerId));
    });

    battle.updateState(getState().battle);
    this._send(BATTLE_REQUEST, opponent.socketId, { data: battle.toJSON() });
  };

  //
  //
  // ============ private ============
  //
  //

  @log(_setUserReadyLog)
  private async _setUserReady(user) {
    const { ws } = this;
    const { name, status } = await user.updateStatus(UserStatusType.Ready);
    this._broadcastStatusUpdate({ name, status });
    ws.emit(USER_UPDATE_STATUS, status);
  }

  @log(_newBattleLog)
  private async _newBattle(user, opponent) {
    await user.updateStatus(UserStatusType.Fight);
    const battle = await this.Battle.newBattle(user, opponent);

    this._broadcastStatusUpdate(user);
    this._broadcastStatusUpdate(opponent);

    return battle;
  }

  private async _createDeck(userId, opponentId, store) {
    userId = userId.toString();
    opponentId = opponentId.toString();
    // let cards: any[] = (await new Promise(ok =>
    //   this.ws.emit(SELECT_CARDS_FOR_DECK, createRandomCards(DECK_INIT_SIZE), ok)
    // )) as any;
    // if (cards.length < DECK_INIT_SIZE) {
    //   cards = [...cards, ...createRandomCards(DECK_INIT_SIZE - cards.length)];
    // }
    // store.dispatch(playerAddCards(cards));
    store.dispatch(
      playerAddCards(userId.toString(), createRandomCards(3, userId))
    );
    store.dispatch(
      playerAddCards(opponentId.toString(), createRandomCards(3, opponentId))
    );
  }

  private _broadcastStatusUpdate({ name, status }) {
    this._broadcast(USERS_UPSERT, { name, status });
  }

  private _send(event, opponentSid, ...args) {
    this.ws.emit(event, ...args);
    this.ws.to(opponentSid).emit(event, ...args);
  }

  private _sendWithCallBack(event, opponentSid, ...args) {
    const cb = args.pop();
    this.ws.emit(event, ...args);
    cb(...args);
  }

  private _broadcast(event, ...args) {
    this.ws.emit(event, ...args);
    this.ws.broadcast.emit(event, ...args);
  }
}
