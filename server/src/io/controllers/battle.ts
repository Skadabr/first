import bind from "bind-decorator";

import { createRandomCards } from "../../lib/cards";
import { UserStatusType, DECK_INIT_SIZE } from "../../constants";

import { log } from "../../logger";
import {
  _newBattleLog,
  _setUserReadyLog
} from "../../logger/controllers/battle";

import {
  USERS_UPSERT,
  USER_UPDATE_STATUS,
  BATTLE_REQUEST,
  TURN,
  SELECT_CARDS_FOR_DECK
} from "../game";

import { validateAddUnitParams } from "../../validators/battle";

import { createStore } from "../../reducer";
//
// ============ actions ============
//
import { battleNextTurn } from "../../actions/battle/index";
import {
  playerAddCards,
  playerAddUnit,
  playerRemoveCard,
  playerDecreseMoney,
  playerAdjustMoney
} from "../../actions/battle/player";
import {
  unitSetMoves,
  unitSetAvailability,
  unitDecreaseMoves,
  unitAttack
} from "../../actions/battle/unit";
import { playerRemoveUnit } from "../../actions/battle/player";
//
// ============ selectors ============
//
import {
  isTurnOwner,
  getTurnOwner,
  getCard,
  getPlayer,
  getPlayerUnitIds,
  getOpponentUnitIds,
  getNextTurnOwnerPlayer,
  getUnitsByUserId,
  getAllAvailableTargetIds,
  getRawUnitSource,
  getDeadOpponentUnits
} from "../../selectors/battle/index";
import { getUserInfo } from "../../selectors/user";

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
    const opponent = await User.acquireOpponent(ws.user);
    if (!opponent) {
      await this._setUserReady(ws.user);
      return;
    }
    const battle = await this._newBattle(ws.user, opponent);
    const store = createStore(battle.toJSON(), ws.user.toJSON());
    await this._createDeck(ws.user._id, opponent._id, store);

    battle.updateState(store.getState().battle);

    this._send(BATTLE_REQUEST, opponent.socket_id, {
      data: store.getState().battle
    });
  }

  //
  // ============ addUnit ============
  //

  public addUnit = async ({ card_id, position }, cb) => {
    const { store, battle, opponent } = this.ws;

    const card = getCard(store.getState(), card_id);
    const player = getPlayer(store.getState());

    const { error } = validateAddUnitParams(card, player, position);
    if (error) return cb({ error });

    store.dispatch(playerRemoveCard(card));
    store.dispatch(playerDecreseMoney(player.user._id, card.unit.cost));
    store.dispatch(playerAddUnit(card.unit, position));

    battle.updateState(store.getState().battle);

    this._send(BATTLE_REQUEST, opponent.socket_id, { data: battle.toJSON() });
  };

  //
  // ============ passTheTurn ============
  //

  public passTheTurn = async () => {
    const { store, battle, opponent } = this.ws;
    let state = store.getState();

    const turnOwner = getTurnOwner(state);

    if (!isTurnOwner(state)) return;

    getPlayerUnitIds(store.getState()).forEach(unit_id => {
      store.dispatch(unitSetMoves(unit_id, 0));
      store.dispatch(unitSetAvailability(unit_id, 1));
    });
    getOpponentUnitIds(store.getState()).forEach(unit_id => {
      store.dispatch(unitSetMoves(unit_id, 1));
      store.dispatch(unitSetAvailability(unit_id, 0));
    });
    store.dispatch(playerAdjustMoney(turnOwner));
    store.dispatch(battleNextTurn());

    battle.updateState(store.getState().battle);
    this._send(BATTLE_REQUEST, opponent.socket_id, { data: battle.toJSON() });
  };

  //
  // ============ attack ============
  //

  public attack = async ({ unit_id, target_id }) => {
    const { store, battle, opponent } = this.ws;
    const { dispatch, getState } = store;
    const state = getState();

    const turnOwner = getTurnOwner(state);
    if (!isTurnOwner(state)) return;

    const targetIds = getAllAvailableTargetIds(unit_id, state);

    if (!targetIds.includes(target_id)) return;

    const rawUnit = getRawUnitSource(unit_id, target_id, state);

    dispatch(unitAttack(target_id, rawUnit.damage));
    dispatch(unitDecreaseMoves(unit_id, 1));

    const deadUnits = getDeadOpponentUnits(getState());

    deadUnits.forEach(unit => {
      dispatch(playerRemoveUnit(unit._id, unit.owner_id));
    });

    battle.updateState(getState().battle);
    this._send(BATTLE_REQUEST, opponent.socket_id, { data: battle.toJSON() });
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

  private async _createDeck(user_id, opponent_id, store) {
    user_id = user_id.toString();
    opponent_id = opponent_id.toString();
    // let cards: any[] = (await new Promise(ok =>
    //   this.ws.emit(SELECT_CARDS_FOR_DECK, createRandomCards(DECK_INIT_SIZE), ok)
    // )) as any;
    // if (cards.length < DECK_INIT_SIZE) {
    //   cards = [...cards, ...createRandomCards(DECK_INIT_SIZE - cards.length)];
    // }
    // store.dispatch(playerAddCards(cards));
    store.dispatch(
      playerAddCards(user_id.toString(), createRandomCards(3, user_id))
    );
    store.dispatch(
      playerAddCards(opponent_id.toString(), createRandomCards(3, opponent_id))
    );
  }

  private _broadcastStatusUpdate({ name, status }) {
    this._broadcast(USERS_UPSERT, { name, status });
  }

  private _send(event, opponent_sid, ...args) {
    this.ws.emit(event, ...args);
    this.ws.to(opponent_sid).emit(event, ...args);
  }

  private _sendWithCallBack(event, opponent_sid, ...args) {
    const cb = args.pop();
    this.ws.emit(event, ...args);
    cb(...args);
  }

  private _broadcast(event, ...args) {
    this.ws.emit(event, ...args);
    this.ws.broadcast.emit(event, ...args);
  }
}
