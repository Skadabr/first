import jwt from "jsonwebtoken";
import only from "only";

import { PEACE, READY, FIGHT } from "../models/user";

const OPPONENT_GOES = "OPPONENT_GOES";
const OPPONENTS_LOAD = "OPPONENTS_LOAD";
const OPPONENT_UPSERT = "OPPONENT_UPSERT";
const USER_READY = "USER_READY";
const USER_UPDATE = "USER_UPDATE";
const START_FIGHT = "START_FIGHT";
const END_OF_FIGHT = "END_OF_FIGHT";
const SEND_MESSAGE = "SEND_MESSAGE";
const ADD_MESSAGE = "ADD_MESSAGE";
const FINISH_FIGHT = "FINISH_FIGHT";
const TURN = "TURN";
const ACQUIRE_TURN = "ACQUIRE_TURN";

const ME = "ME";
const OPPONENT = "OPPONENT";

export default function(ws, { models, logger }) {
  const User = models.model("User");

  ws.on("disconnect", async () => {
    logger.debug("disconnect of ", ws.id);

    if (ws.opponent_id) {
      const opponent = await User.findOneAndUpdate(
        { socket_id: ws.opponent_id },
        { status: PEACE }
      );
      const user = await User.findOneAndUpdate(
        { socket_id: ws.id },
        { socket_id: null, status: PEACE, money: ws.orig_user_money }
      );
      ws.to(ws.opponent_id).emit(END_OF_FIGHT, {
        status: "break",
        money: ws.orig_opponent_money
      });
      ws.nsp.connected[ws.opponent_id].opponent_id = undefined;

      return;
    }

    const user = await User.findOneAndUpdate(
      { socket_id: ws.id },
      { socket_id: null, status: PEACE }
    );
    if (user) {
      logger.debug(`${user.name}(id: ${ws.id}) goes`);
      ws.broadcast.emit(OPPONENT_GOES, user.name);
    }
  });

  ws.on(OPPONENTS_LOAD, cb => {
    User.find({ socket_id: { $ne: null } })
      .then(users => {
        const data = users.map(({ name, status }) => ({ name, status }));
        cb({ data });
        logger.debug("load opponents");
      })
      .catch(err => {
        logger.debug("can't load users: " + err.message);
        cb({ error: { message: err.message } });
      });
  });

  ws.on(USER_READY, async () => {
    const opponent = await User.getOpponent(ws.user);

    if (!opponent) {
      const { name, status } = await ws.user.updateStatus(READY);
      logger.debug(`user "${name}" ready to fight`);
      ws.broadcast.emit(OPPONENT_UPSERT, { name, status });
      ws.emit(USER_UPDATE, { status });
      return;
    }

    ws.opponent_id = opponent.socket_id;
    ws.nsp.connected[opponent.socket_id].opponent_id = ws.id;

    ws.orig_user_money = ws.user.money;
    ws.orig_opponent_money = opponent.money;
    ws.nsp.connected[opponent.socket_id].orig_user_money = opponent.money;
    ws.nsp.connected[opponent.socket_id].orig_opponent_money = ws.user.money;

    await ws.user.updateStatus(FIGHT);

    ws.emit(OPPONENT_UPSERT, only(opponent, "name status"));
    ws.broadcast.emit(OPPONENT_UPSERT, only(opponent, "name status"));
    ws.broadcast.emit(OPPONENT_UPSERT, only(ws.user, "name status"));

    logger.debug(
      `${ws.user.name}(${ws.id}) fights with ${opponent.name}(${
        opponent.socket_id
      })`
    );

    //await ws.user.startGame(opponent);

    ws.emit(START_FIGHT, {
      turn: true,
      [ME]: only(ws.user, "name money"),
      [OPPONENT]: only(opponent, "name")
    });
    ws.to(opponent.socket_id).emit(START_FIGHT, {
      turn: false,
      [ME]: only(opponent, "name money"),
      [OPPONENT]: only(ws.user, "name")
    });
  });

  ws.on(SEND_MESSAGE, data => {
    if (!ws.opponent_id) return;
    ws.to(ws.opponent_id).emit(ADD_MESSAGE, data);
  });

  ws.on(TURN, async data => {
    const { me, opponent } = data;
    await ws.user.update({ money: me.money });
    ws
      .to(ws.opponent_id)
      .emit(ACQUIRE_TURN, { [ME]: opponent, [OPPONENT]: me });
  });

  ws.on(FINISH_FIGHT, async () => {
    const opponent = await User.findOneAndUpdate(
      { socket_id: ws.opponent_id },
      { status: "PEACE" },
      { new: true }
    );
    const gain = ws.orig_opponent_money - opponent.money;
    const money = ws.orig_user_money + gain;
    await ws.user.update({ money, status: "PEACE" });

    ws.emit(OPPONENT_UPSERT, only(opponent, "name status"));
    ws.broadcast.emit(OPPONENT_UPSERT, only(opponent, "name status"));
    ws.broadcast.emit(OPPONENT_UPSERT, { name: ws.user.name, status: "PEACE" });

    ws.emit(END_OF_FIGHT, { status: "win", money });
    ws
      .to(ws.opponent_id)
      .emit(END_OF_FIGHT, { status: "lose", money: opponent.money });

    logger.debug(`winner ${ws.user.name} and gain ${gain}`);

    ws.nsp.connected[ws.opponent_id] = undefined;
    ws.opponent_id = undefined;
  });
}
