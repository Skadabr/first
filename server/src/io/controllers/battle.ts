import bind from "bind-decorator";

import { log } from "../../logger";
import {
  _newBattleLog,
  _setUserReadyLog
} from "../../logger/controllers/battle";
import { Battle, UserStatusType, validators } from "core";

import { USERS_UPSERT, USER_UPDATE_STATUS, BATTLE_REQUEST } from "../game";

const { validateAddUnitParams } = validators;
//
// ============ controller ============
//

export default class BattleController {
  private readonly ws: any;
  private readonly Battle: any;
  private readonly User: any;

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

    const enemy = await User.acquireEnemy(ws.user);

    if (!enemy) return await this._setUserReady(ws.user);

    const battleCollection = await this._newBattle(ws.user, enemy);
    const battleJSON = battleCollection.toJSON();
    const battle = new Battle(battleJSON, ws.user.toJSON());

    //battleCollection.updateState(battle.toJSON().battle);

    this._send(BATTLE_REQUEST, enemy.socketId, {
      data: battle.toJSON()
    });
  }

  //
  // ============ addTestUnit ============
  //

  public playCard = async ({ cardId, position }, cb) => {
    const { battle: battleCollection, enemy, user } = this.ws;

    const battleJSONInit = battleCollection.toJSON();
    const userJSON = user.toJSON();

    const battle = new Battle(battleJSONInit, userJSON);

    try {
      battle.playCard(cardId, position);

      const data = battle.toJSON();

      battleCollection.updateState(data);
      this._send(BATTLE_REQUEST, enemy.socketId, { data });
    } catch (err) {
      // ?????????
    }
  };

  //
  // ============ passTheTurn ============
  //

  public passTheTurn = async () => {
    const { user, battle: battleCollection, enemy } = this.ws;

    const battle = new Battle(battleCollection.toJSON(), user.toJSON());

    battle.nextTurn();

    const data = battleCollection.toJSON();

    battleCollection.updateState(data);
    this._send(BATTLE_REQUEST, enemy.socketId, { data });
  };

  //
  // ============ attack ============
  //

  public attack = async ({ unitId, targetId }) => {
    const { store, battle, enemy } = this.ws;
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
    this._send(BATTLE_REQUEST, enemy.socketId, { data: battle.toJSON() });
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
  private async _newBattle(user, enemy) {
    await user.updateStatus(UserStatusType.Fight);
    const battle = await this.Battle.newBattle(user, enemy);

    this._broadcastStatusUpdate(user);
    this._broadcastStatusUpdate(enemy);

    return battle;
  }

  private async _createDeck(userId, enemyId, store) {
    userId = userId.toString();
    enemyId = enemyId.toString();
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
      playerAddCards(enemyId.toString(), createRandomCards(3, enemyId))
    );
  }

  private _broadcastStatusUpdate({ name, status }) {
    this._broadcast(USERS_UPSERT, { name, status });
  }

  private _send(event, enemySid, ...args) {
    this.ws.emit(event, ...args);
    this.ws.to(enemySid).emit(event, ...args);
  }

  private _sendWithCallBack(event, enemySid, ...args) {
    const cb = args.pop();
    this.ws.emit(event, ...args);
    cb(...args);
  }

  private _broadcast(event, ...args) {
    this.ws.emit(event, ...args);
    this.ws.broadcast.emit(event, ...args);
  }
}
