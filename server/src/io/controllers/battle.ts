import { UserStatusType } from "../../constants";
import { log } from "../../logger";
import {
  OPPONENT_GOES,
  OPPONENTS_LOAD,
  OPPONENT_UPSERT,
  SEND_MESSAGE,
  USER_UPDATE_STATUS,
  BATTLE_CREATE,
  TURN,
} from "../game";

export default class BattleController {

  //
  // ============ private ============
  //


  private _send = (event, opponent_sid, ...args) => {
    this.ws.emit(event, ...args);
    this.ws.to(opponent_sid).emit(event, ...args);
  };

  private _sendWithCallBack = (event, opponent_sid, ...args) => {
    const cb = args.pop();
    this.ws.emit(event, ...args);
    cb(...args);
  };

  private _broadcast = (event, ...args) => {
    this.ws.emit(event, ...args);
    this.ws.broadcast.emit(event, ...args);
  };
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
