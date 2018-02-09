import only = require("only");

import {
  MIDDLE_POSITION,
  MAX_WARRIORS_ON_FIELD,
  StatusKinds,
  WarriorKinds
} from "../constants";
import { WarriorJSON, WarriorSamples } from "../models/warrior";

const OPPONENT_GOES = "OPPONENT_GOES";
const OPPONENTS_LOAD = "OPPONENTS_LOAD";
const OPPONENT_UPSERT = "OPPONENT_UPSERT";
const USER_READY = "USER_READY";
const USER_UPDATE_STATUS = "USER_UPDATE_STATUS";
const START_FIGHT = "START_FIGHT";
const END_OF_FIGHT = "END_OF_FIGHT";
const SEND_MESSAGE = "SEND_MESSAGE";
const ADD_MESSAGE = "ADD_MESSAGE";
const FINISH_FIGHT = "FINISH_FIGHT";
const TURN = "TURN";
const ACQUIRE_TURN = "ACQUIRE_TURN";
const ADD_WARRIOR = "ADD_WARRIOR";
const ON_ADD_WARRIOR = "ON_ADD_WARRIOR";
const KICK_OPPONENTS = "KICK_OPPONENTS";

export default function(ws, opts) {
  const { models, logger } = opts;
  const User = models.model("User");
  const Warrior = models.model("Warrior");

  ws.on("disconnect", async () => {
    logger.debug("io:game - disconnect of ", ws.id);

    const user = ws.user;
    const opponent = await User.opponent(ws.user);

    if (opponent) {
      await opponent.resetGameData();
    }
    await user.onDisconnect();

    logger.debug(`io:game - ${user.name}(id: ${ws.id}) goes`);
    ws.broadcast.emit(OPPONENT_GOES, user.name);
  });

  ws.on(OPPONENTS_LOAD, cb => {
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

    ws.emit(OPPONENT_UPSERT, only(opponent, "name status"));
    ws.broadcast.emit(OPPONENT_UPSERT, only(opponent, "name status"));
    ws.emit(OPPONENT_UPSERT, only(user, "name status"));
    ws.broadcast.emit(OPPONENT_UPSERT, only(user, "name status"));

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
    const opponent = await User.opponent(ws.user);
    if (!opponent) return;
    ws.to(opponent.socket_id).emit(ADD_MESSAGE, data);
    logger.debug(`io:game - send message to ${opponent.name}`);
  });

  ws.on(ADD_WARRIOR, async ({ kind, position }, cb) => {
    if (typeof kind !== "number" || kind < 0)
      throw TypeError("Kind has wrong type");
    if (typeof position !== "number" || position < 0)
      throw TypeError("Position has wrong type");

    const user = ws.user;
    const opponent = await User.opponent(ws.user);

    logger.debug(
      `${user.name} is going to add ${
        WarriorSamples[kind].name
      } on pos:(${position}) to ${opponent.name}`
    );

    const price = WarriorSamples[kind].price;
    const current_money = user.gamer.current_money;

    if (price > current_money) {
      return cb();
    }

    const warriors = await Warrior.addWarrior(user._id, kind, position);

    if (warriors === null) cb();

    user.gamer.current_money = current_money - price;
    await user.save();

    cb({
      owner_name: user.name,
      warriors,
      money: user.gamer.current_money
    });
    ws.to(opponent.socket_id).emit(ON_ADD_WARRIOR, {
      owner_name: user.name,
      warriors,
      money: user.gamer.current_money
    });
  });

  ws.on(KICK_OPPONENTS, async ({ kind }, cb) => {
    if (typeof kind !== "number" || kind < 0)
      throw TypeError("Kind has wrong type");

    const user = ws.user;
    const opponent = await User.opponent(ws.user);

    const opponent_warriors = await Warrior.of(opponent._id);
    const warrior = Warrior.getSample(kind);

    if (opponent_warriors.length === 0) {
      const health = opponent.gamer.health - warrior.damage;
      ws.emit(KICK_GAMER, { damage: warrior.damage }, )
      return dispatch(gamerKicked(opponent.name, warrior.damage));
    }


//return dispatch => {
//  console.debug("kickOpponents", warrior, opponent, opponent_warriors);

//  const { position, damage } = warrior;
//  const w = opponent_warriors.find(w => w.position === position);

//  if (w) return dispatch(warriorKicked(opponent.name, w.id, damage));

//  const ws = opponent_warriors.filter(
//    w => w.position === position - 1 || w.position === position + 1
//  );

//  if (ws.length === 0) dispatch(gamerKicked(opponent.name, warrior.damage));
//  else
//    for (const w of ws) dispatch(warriorKicked(opponent.name, w.id, damage));
//};
  })

  //ws.on(TURN, async data => {
  //  const { me, opponent } = data;
  //  ws.to(ws.opponent_id).emit(ACQUIRE_TURN, { me: opponent, opponent: me });
  //  logger.debug(
  //    `io:gamer - pass the turn from ${me.name} to ${opponent.name}`
  //  );
  //});

  //ws.on(FINISH_FIGHT, async () => {
  //  const opponent = await User.findOneAndUpdate(
  //    { socket_id: ws.opponent_id },
  //    { status: "PEACE" },
  //    { new: true }
  //  );
  //  const gain = ws.orig_opponent_money - opponent.money;
  //  const money = ws.orig_user_money + gain;
  //  await ws.user.update({ money, status: "PEACE" });

  //  ws.emit(OPPONENT_UPSERT, only(opponent, "name status"));
  //  ws.broadcast.emit(OPPONENT_UPSERT, only(opponent, "name status"));
  //  ws.broadcast.emit(OPPONENT_UPSERT, { name: ws.user.name, status: "PEACE" });

  //  ws.emit(END_OF_FIGHT, { status: "win", money });
  //  ws
  //    .to(ws.opponent_id)
  //    .emit(END_OF_FIGHT, { status: "lose", money: opponent.money });

  //  logger.debug(`winner ${ws.user.name} and gain ${gain}`);

  //  ws.nsp.connected[ws.opponent_id] = undefined;
  //  ws.opponent_id = undefined;
  //});
}
