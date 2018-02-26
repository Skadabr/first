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
import {
  playerAddCards,
  playerAddUnit,
  playerRemoveCard,
  playerDecreseMoney
} from "../../actions/battle/player";
import { cardSelector, playerSelector } from "../../selectors/battle";

import { applyEffects as applyCardEffects } from "../../lib/cards/effects";

export default class BattleController {
  private ws: any;
  private Battle: any;
  private User: any;

  constructor(ws, { models }) {
    this.ws = ws;
    this.Battle = models.model("Battle");
    this.User = models.model("User");
  }

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

  public addUnit = async ({ card_id, position }, cb) => {
    const { ws } = this;
    const battleJSON = ws.battle.toJSON();
    const userJSON = ws.user.toJSON();
    const store = createStore(battleJSON, userJSON);

    const card = cardSelector(store.getState(), card_id);
    const player = playerSelector(store.getState());

    const { error } = validateAddUnitParams(card, player, position);
    if (error) return cb({ error });

    store.dispatch(playerRemoveCard(card));
    store.dispatch(playerDecreseMoney(player, card.unit.cost));
    store.dispatch(playerAddUnit(card.unit, position, card.effects));

    ws.battle.updateState(store.getState().battle);

    this._send(BATTLE_REQUEST, ws.opponent.socket_id, {
      data: ws.battle.toJSON()
    });
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

//    addWarrior({type, position}, cb) {
//      logger.debug("io:game ----  ADD_WARRIOR ----");
//      if (typeof kind !== "number" || kind < 0)
//        throw TypeError("Kind has wrong type");
//      if (typeof position !== "number" || position < 0)
//        throw TypeError("Position has wrong type");
//
//      try {
//        const user = ws.user;
//        const opponent = await User.opponent(ws.user);
//
//        const warriorSample = Warrior.getSample(kind);
//        logger.debug(
//          `${user.name} is going to add ${
//            warriorSample.name
//          } on pos:(${position}) to ${opponent.name}`
//        );
//
//        const price = warriorSample.price;
//        const current_money = user.gamer.current_money;
//
//        if (price > current_money) {
//          return cb({
//            error: {
//              reason: "lack of money",
//              msg: "You don't have enough money to buy this warrior"
//            }
//          });
//        }
//
//        const warriors = await Warrior.addWarrior(user._id, kind, position);
//
//        if (warriors === null) cb();
//
//        user.gamer.current_money = current_money - price;
//        await user.save();
//
//        cb({
//          data: {
//            owner_name: user.name,
//            warriors,
//            money: user.gamer.current_money
//          }
//        });
//        ws.to(opponent.socket_id).emit(UPDATE_WARRIOR, {
//          data: {
//            owner_name: user.name,
//            warriors,
//            money: user.gamer.current_money
//          }
//        });
//      } catch (err) {
//        if (err.reason) {
//          cb({
//            error: {
//              reason: err.reason,
//              msg: err.message
//            }
//          });
//        } else {
//          logger.error(err.message);
//          logger.debug(err.stack);
//        }
//      }
//    }

//  ws.on(KICK_OPPONENTS, async ({ _id }, cb) => {
//    logger.debug("io:game ----  KICK_OPPONENTS ----");
//    try {
//      const warrior = await Warrior.findOne({ _id });
//
//      if (!warrior) {
//        logger.debug(
//          "io:game - (kick_opponents) - there is no warrior with such id"
//        );
//        return cb({
//          error: {
//            reason: "warrior doesn't exist",
//            msg: "There is no warrior with such id"
//          }
//        });
//      }
//
//      const user = ws.user;
//      const opponent = await User.opponent(ws.user);
//
//      const opponent_warriors = await Warrior.of(opponent._id);
//
//      const { position } = warrior;
//      const { damage } = Warrior.getSample(warrior.kind);
//
//      if (opponent_warriors.length === 0) {
//        logger.debug("io:game - (kick_opponents) - no warriors, kick gamer");
//        return kickGamer(user, opponent, damage, ws, cb);
//      }
//
//      let opWarrior = opponent_warriors.find(w => w.position === position);
//
//      if (opWarrior) {
//        logger.debug(
//          "io:game - (kick_opponents) - kick warrior in front of you"
//        );
//        return kickWarrior([opWarrior], opponent, damage, ws, cb);
//      }
//
//      const opWarriors = opponent_warriors.filter(
//        w => w.position === position - 1 || w.position === position + 1
//      );
//
//      if (opWarriors.length === 0) {
//        logger.debug(
//          "io:game - (kick_opponents) - warrior exist, but kick gamer"
//        );
//        return kickGamer(user, opponent, damage, ws, cb);
//      } else {
//        logger.debug(
//          "io:game - (kick_opponents) - kick warriors left/right from you"
//        );
//        await kickWarrior(opWarriors, opponent, damage, ws, cb);
//      }
//
//      return;
//    } catch (err) {
//      logger.error(err.message);
//      logger.debug(err.stack);
//      cb({
//        error: {
//          msg: err.message
//        }
//      });
//    }
//    cb({
//      error: {
//        msg: "I'm a tippot, miss some important code-path"
//      }
//    });
//  });

//  ws.on(TURN, async cb => {
//    const user = ws.user;
//    const opponent = await User.opponent(user);
//
//    await user.increaseMoney();
//
//    cb({
//      data: {
//        name: user.name,
//        money: user.gamer.current_money
//      }
//    });
//    ws.to(opponent.socket_id).emit(TURN, {
//      data: {
//        name: user.name,
//        money: user.gamer.current_money
//      }
//    });
//    logger.debug(
//      `io:gamer - pass the turn from ${ws.user.name} to ${opponent.name}`
//    );
//  });

//
// ============ helpers ============
//

//async function kickGamer(user, opponent, damage, ws, cb) {
//  const health = (opponent.gamer.health = opponent.gamer.health - damage);
//  const data = [];

//  await opponent.save();

//  data.push({
//    type: GAMER_KICKED,
//    data: {
//      name: opponent.name,
//      health
//    }
//  });

//  if (health <= 0) {
//    await user.winFight();
//    await opponent.loseFight();

//    informAboutStatusUpdate(ws, user, opponent);

//    data.push({
//      type: FINISH_FIGHT,
//      data: {
//        winner_name: user.name
//      }
//    });
//  }

//  ws.to(opponent.socket_id).emit(KICK_OPPONENTS, { data });
//  cb({ data });
//}

//async function kickWarrior(opWarriors, opponent, damage, ws, cb) {
//  const data = [];
//  for (const w of opWarriors) {
//    const dead = await Warrior.kickWarrior(opponent._id, w, damage);
//    if (dead) {
//      data.push({
//        type: WARRIOR_REMOVE,
//        data: {
//          owner_name: opponent.name,
//          _id: w._id
//        }
//      });
//    } else {
//      data.push({
//        type: WARRIOR_KICKED,
//        data: {
//          owner_name: opponent.name,
//          _id: w._id,
//          health: w.health
//        }
//      });
//    }
//  }
//  ws.to(opponent.socket_id).emit(KICK_OPPONENTS, { data });
//  cb({ data });
//}
