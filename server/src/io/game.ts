import only = require("only");

import {
  MIDDLE_POSITION,
  MAX_WARRIORS_ON_FIELD,
  StatusKinds,
  WarriorKinds
} from "../constants";
import { WarriorJSON } from "../models/warrior";

const OPPONENT_GOES = "OPPONENT_GOES";
const OPPONENTS_LOAD = "OPPONENTS_LOAD";
const OPPONENT_UPSERT = "OPPONENT_UPSERT";
const USER_READY = "USER_READY";
const USER_UPDATE_STATUS = "USER_UPDATE_STATUS";
const START_FIGHT = "START_FIGHT";
const SEND_MESSAGE = "SEND_MESSAGE";
const ADD_MESSAGE = "ADD_MESSAGE";
const TURN = "TURN";

const ADD_WARRIOR = "ADD_WARRIOR";
const UPDATE_WARRIOR = "UPDATE_WARRIOR";
const KICK_OPPONENTS = "KICK_OPPONENTS";

const GAMER_KICKED = "GAMER_KICKED";
const WARRIOR_KICKED = "WARRIOR_KICKED";
const WARRIOR_REMOVE = "WARRIOR_REMOVE";
const FINISH_FIGHT = "FINISH_FIGHT";

export default function(ws, opts) {
  const { models, logger } = opts;
  const User = models.model("User");
  const Warrior = models.model("Warrior");

  ws.on("disconnect", async () => {
    logger.debug("io:game - disconnect of ", ws.id);

    const user = ws.user;

    if (!user) return;

    const opponent = await User.opponent(ws.user);

    if (opponent) await opponent.resetGameData();
    await user.onDisconnect();

    logger.debug(`io:game - ${user.name}(id: ${ws.id}) goes`);
    ws.broadcast.emit(OPPONENT_GOES, user.name);
  });

  ws.on(OPPONENTS_LOAD, cb => {
    logger.debug("io:game ---- OPPONENTS_LOAD ----");
    User.find({ socket_id: { $ne: null } })
      .then(users => {
        const data = users.map(({ name, status }) => ({ name, status }));
        cb({ data });
        logger.debug("io:game - load opponents");
      })
      .catch(err => {
        logger.debug("io:game - can't load users: " + err.message);
        cb({ error: { message: err.message } });
      });
  });

  ws.on(USER_READY, async cb => {
    logger.debug("io:game ---- USER_READY ----");
    const user = ws.user;
    const opponent = await User.acquireOpponent(ws.user);

    if (!opponent) {
      const { name, status } = await ws.user.updateStatus(StatusKinds.READY);
      logger.debug(`io:game - user "${name}" ready to fight`);
      ws.broadcast.emit(OPPONENT_UPSERT, { name, status });
      ws.emit(OPPONENT_UPSERT, { name, status });
      ws.emit(USER_UPDATE_STATUS, status);
      return;
    }

    await user.updateStatus(StatusKinds.FIGHT);
    await user.initGame(opponent);

    hailAboutStatusUpdate(ws, user, opponent);

    logger.debug(
      `io:game - ${user.name}(${ws.id}) fights with ${opponent.name}(${
        opponent.socket_id
      })`
    );

    ws.emit(START_FIGHT, {
      turn: true,
      me: user.gamerInitData(),
      opponent: opponent.gamerInitData()
    });
    ws.to(opponent.socket_id).emit(START_FIGHT, {
      turn: false,
      me: opponent.gamerInitData(),
      opponent: user.gamerInitData()
    });
  });

  ws.on(SEND_MESSAGE, async data => {
    logger.debug("io:game ----  SEND_MESSAGE ----");
    const opponent = await User.opponent(ws.user);
    if (!opponent) return;
    ws.to(opponent.socket_id).emit(ADD_MESSAGE, data);
    logger.debug(`io:game - send message to ${opponent.name}`);
  });

  ws.on(ADD_WARRIOR, async ({ kind, position }, cb) => {
    logger.debug("io:game ----  ADD_WARRIOR ----");
    if (typeof kind !== "number" || kind < 0)
      throw TypeError("Kind has wrong type");
    if (typeof position !== "number" || position < 0)
      throw TypeError("Position has wrong type");

    try {
      const user = ws.user;
      const opponent = await User.opponent(ws.user);

      const warriorSample = Warrior.getSample(kind);
      logger.debug(
        `${user.name} is going to add ${
          warriorSample.name
        } on pos:(${position}) to ${opponent.name}`
      );

      const price = warriorSample.price;
      const current_money = user.gamer.current_money;

      if (price > current_money) {
        return cb({
          error: {
            reason: "lack of money",
            msg: "You don't have enough money to buy this warrior"
          }
        });
      }

      const warriors = await Warrior.addWarrior(user._id, kind, position);

      if (warriors === null) cb();

      user.gamer.current_money = current_money - price;
      await user.save();

      cb({
        data: {
          owner_name: user.name,
          warriors,
          money: user.gamer.current_money
        }
      });
      ws.to(opponent.socket_id).emit(UPDATE_WARRIOR, {
        data: {
          owner_name: user.name,
          warriors,
          money: user.gamer.current_money
        }
      });
    } catch (err) {
      if (err.reason) {
        cb({
          error: {
            reason: err.reason,
            msg: err.message
          }
        });
      } else {
        logger.error(err.message);
        logger.debug(err.stack);
      }
    }
  });

  ws.on(KICK_OPPONENTS, async ({ _id }, cb) => {
    logger.debug("io:game ----  KICK_OPPONENTS ----");
    try {
      const warrior = await Warrior.findOne({ _id });

      if (!warrior) {
        logger.debug(
          "io:game - (kick_opponents) - there is no warrior with such id"
        );
        return cb({
          error: {
            reason: "warrior doesn't exist",
            msg: "There is no warrior with such id"
          }
        });
      }

      const user = ws.user;
      const opponent = await User.opponent(ws.user);

      const opponent_warriors = await Warrior.of(opponent._id);

      const { position } = warrior;
      const { damage } = Warrior.getSample(warrior.kind);

      if (opponent_warriors.length === 0) {
        logger.debug("io:game - (kick_opponents) - no warriors, kick gamer");
        return kickGamer(user, opponent, damage, ws, cb);
      }

      let opWarrior = opponent_warriors.find(w => w.position === position);

      if (opWarrior) {
        logger.debug(
          "io:game - (kick_opponents) - kick warrior in front of you"
        );
        return kickWarrior([opWarrior], opponent, damage, ws, cb);
      }

      const opWarriors = opponent_warriors.filter(
        w => w.position === position - 1 || w.position === position + 1
      );

      if (opWarriors.length === 0) {
        logger.debug(
          "io:game - (kick_opponents) - warrior exist, but kick gamer"
        );
        return kickGamer(user, opponent, damage, ws, cb);
      } else {
        logger.debug(
          "io:game - (kick_opponents) - kick warriors left/right from you"
        );
        await kickWarrior(opWarriors, opponent, damage, ws, cb);
      }

      return;
    } catch (err) {
      logger.error(err.message);
      logger.debug(err.stack);
      cb({
        error: {
          msg: err.message
        }
      });
    }
    cb({
      error: {
        msg: "I'm a tippot, miss some important code-path"
      }
    });
  });

  ws.on(TURN, async cb => {
    const user = ws.user;
    const opponent = await User.opponent(user);

    await user.increaseMoney();

    cb({
      data: {
        name: user.name,
        money: user.gamer.current_money
      }
    });
    ws.to(opponent.socket_id).emit(TURN, {
      data: {
        name: user.name,
        money: user.gamer.current_money
      }
    });
    logger.debug(
      `io:gamer - pass the turn from ${ws.user.name} to ${opponent.name}`
    );
  });

  //
  // ============ helpers ============
  //

  async function kickGamer(user, opponent, damage, ws, cb) {
    const health = (opponent.gamer.health = opponent.gamer.health - damage);
    const data = [];

    await opponent.save();

    data.push({
      type: GAMER_KICKED,
      data: {
        name: opponent.name,
        health
      }
    });

    if (health <= 0) {
      await user.winFight();
      await opponent.loseFight();

      hailAboutStatusUpdate(ws, user, opponent);

      data.push({
        type: FINISH_FIGHT,
        data: {
          winner_name: user.name
        }
      });
    }

    ws.to(opponent.socket_id).emit(KICK_OPPONENTS, { data });
    cb({ data });
  }

  async function kickWarrior(opWarriors, opponent, damage, ws, cb) {
    const data = [];
    for (const w of opWarriors) {
      const dead = await Warrior.kickWarrior(opponent._id, w, damage);
      if (dead) {
        data.push({
          type: WARRIOR_REMOVE,
          data: {
            owner_name: opponent.name,
            _id: w._id
          }
        });
      } else {
        data.push({
          type: WARRIOR_KICKED,
          data: {
            owner_name: opponent.name,
            _id: w._id,
            health: w.health
          }
        });
      }
    }
    ws.to(opponent.socket_id).emit(KICK_OPPONENTS, { data });
    cb({ data });
  }

  function hailAboutStatusUpdate(ws, user, opponent) {
    ws.emit(OPPONENT_UPSERT, only(opponent, "name status"));
    ws.broadcast.emit(OPPONENT_UPSERT, only(opponent, "name status"));
    ws.emit(OPPONENT_UPSERT, only(user, "name status"));
    ws.broadcast.emit(OPPONENT_UPSERT, only(user, "name status"));
  }
}
