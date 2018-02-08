import jwt from "jsonwebtoken";
import only from "only";

import { PEACE, READY, FIGHT } from "../models/user";
import { MIDDLE_POSITION } from "../constants";

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
const UPDATE_WARRIORS = "UPDATE_WARRIORS";

export default function(ws, opts) {
  const { models, logger } = opts;
  const User = models.model("User");
  const Warrior = models.model("Warrior");

  ws.on("disconnect", async () => {
    logger.debug("io:game - disconnect of ", ws.id);

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
      logger.debug(`io:game - ${user.name}(id: ${ws.id}) goes`);
      ws.broadcast.emit(OPPONENT_GOES, user.name);
    }
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
      const { name, status } = await ws.user.updateStatus(READY);
      logger.debug(`io:game - user "${name}" ready to fight`);
      ws.broadcast.emit(OPPONENT_UPSERT, { name, status });
      ws.emit(USER_UPDATE_STATUS, status);
      return;
    }

    //  ws.opponent_id = opponent.socket_id;
    //  ws.nsp.connected[opponent.socket_id].opponent_id = ws.id;

    await user.updateStatus(FIGHT);
    await user.initGame(opponent);

    ws.emit(OPPONENT_UPSERT, only(opponent, "name status"));
    ws.emit(OPPONENT_UPSERT, only(opponent, "name status"));
    ws.broadcast.emit(OPPONENT_UPSERT, only(opponent, "name status"));
    ws.broadcast.emit(OPPONENT_UPSERT, only(ws.user, "name status"));

    logger.debug(
      `io:game - ${user.name}(${ws.id}) fights with ${opponent.name}(${
        opponent.socket_id
      })`
    );

    ws.emit(START_FIGHT, {
      turn: true,
      me: only(ws.user, "name"),
      opponent: only(opponent, "name")
    });
    ws.to(opponent.socket_id).emit(START_FIGHT, {
      turn: false,
      me: only(opponent, "name"),
      opponent: only(ws.user, "name")
    });
  });

  ws.on(SEND_MESSAGE, data => {
    if (!ws.opponent_id) return;
    ws.to(ws.opponent_id).emit(ADD_MESSAGE, data);
    logger.debug(`io:game - send message to ${ws.opponent_id}`);
  });

  ws.on(ADD_WARRIOR, async ({ kind, position }) => {
    const user = ws.user;
    const opponent = await User.opponent(ws.user);

    const warriors = await Warrior.of(user._id).then();

    if (warriors.find(w => w.position === position)) {
      return state;
    }

    console.log(warriors);

    if (warriors.length === 0) {
      const warrior = await Warrior.createWarrior({
        position: MIDDLE_POSITION,
        owner_id: user._id,
        kind
      });
      warriors.push(warrior.toJSON());
      return ws.emit(UPDATE_WARRIORS, {
        owner_name: user.name,
        warriors,
        money: 1
      });

      //return { ...state, [owner_name]: [warrior] };
    }

    //    // fail: warrior was created inside(here) so it's create coupling
    //    const warrior = createWarrior(type);

    //    if (warriors.length >= MAX_WARRIORS_ON_FIELD) {
    //      return state;
    //    }

    //    return {
    //      ...state,
    //      [owner_name]: adjustWarriors(warriors, warrior, position)
    //    };
  });

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
