import bind from "bind-decorator";

import { log } from "../../logger";
import {
  _newBattleLog,
  _setUserReadyLog
} from "../../logger/controllers/battle";
import { BattleEngine, UserStatusType } from "core";

import {
  USERS_UPSERT,
  USER_UPDATE_STATUS,
  BATTLE_REQUEST,
  BATTLE_UPDATE
} from "../game";
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

  // ============ tryCreateBattle ============

  @bind
  public async tryCreateBattle() {
    const { ws, User } = this;

    const enemy = await User.acquireEnemy(ws.user);

    if (!enemy) return await this._setUserReady(ws.user);

    const battleCollection = await this._createBattle(ws.user, enemy);

    this._send(BATTLE_REQUEST, enemy.socketId, {
      data: {
        battle: battleCollection.toJSON()
      }
    });
  }

  // ============ addTestUnit ============

  public playCard = async ({ cardId, position }) => {
    initializeBattleEngine(this, battleEngine => {
      battleEngine.playCard(cardId, position);
    });
  };

  // ============ passTheTurn ============

  public passTheTurn = () => {
    initializeBattleEngine(this, battleEngine => {
      battleEngine.nextTurn();
    })
  };

  // ============ attack ============

  public attack = async ({ unitId, targetId }) => {
    initializeBattleEngine(this, battleEngine => {
      battleEngine.attack(unitId, targetId);
    })
  };

  //
  // ============ private ============
  //

  @log(_setUserReadyLog)
  private async _setUserReady(user) {
    const { ws } = this;
    const { name, status } = await user.updateStatus(UserStatusType.Ready);
    this._broadcastStatusUpdate({ name, status });
    ws.emit(USER_UPDATE_STATUS, status);
  }

  @log(_newBattleLog)
  private async _createBattle(user, enemy) {
    await user.updateStatus(UserStatusType.Fight);
    const battle = await this.Battle.createBattle(user, enemy);

    this._broadcastStatusUpdate(user);
    this._broadcastStatusUpdate(enemy);

    return battle;
  }

  // private async _createDeck(userId, enemyId, store) {
  //   // userId = userId.toString();
  //   // enemyId = enemyId.toString();
  //   // // let cards: any[] = (await new Promise(ok =>
  //   // //   this.ws.emit(SELECT_CARDS_FOR_DECK, createRandomCards(DECK_INIT_SIZE), ok)
  //   // // )) as any;
  //   // // if (cards.length < DECK_INIT_SIZE) {
  //   // //   cards = [...cards, ...createRandomCards(DECK_INIT_SIZE - cards.length)];
  //   // // }
  //   // // store.dispatch(playerAddCards(cards));
  //   // store.dispatch(
  //   //   playerAddCards(userId.toString(), createRandomCards(3, userId))
  //   // );
  //   // store.dispatch(
  //   //   playerAddCards(enemyId.toString(), createRandomCards(3, enemyId))
  //   // );
  // }

  private _broadcastStatusUpdate({ name, status }) {
    this._broadcast(USERS_UPSERT, { name, status });
  }

  private _send(event, enemySid, ...args) {
    this.ws.emit(event, ...args);
    this.ws.to(enemySid).emit(event, ...args);
  }

  private _broadcast(event, ...args) {
    this.ws.emit(event, ...args);
    this.ws.broadcast.emit(event, ...args);
  }
}

function initializeBattleEngine(battleController, cb: (battle: BattleEngine) => void) {
  const { user, battle: battleCollection, enemy } = this.ws;

  const battleEngine = new BattleEngine(battleCollection.toJSON(), user.toJSON());
  battleEngine.on(
    BattleEngine.BATTLE_EVENT,
    handleBattleEvent(this, battleCollection, enemy.socketId)
  );
  battleEngine.on(
    BattleEngine.BATTLE_ERROR,
    handleBattleError(this, enemy.socketId)
  );

  cb(battleEngine);
}

function handleBattleEvent(battleController, battleCollection, enemySocketId) {
  return async function(ev) {
    const battleJSON = this.toJSON();

    await battleCollection.updateState(battleJSON);
    battleController._send(BATTLE_UPDATE, enemySocketId, {
      data: {
        battle: battleJSON,
        type: ev.type,
        action: ev.action
      }
    });
  };
}

function handleBattleError(battleController, enemySocketId) {
  return error => {
    battleController._send(BATTLE_UPDATE, enemySocketId, { error });
  }
}
