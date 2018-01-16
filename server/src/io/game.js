import jwt from "jsonwebtoken";
import only from "only";

import { PEACE, READY, FIGHT } from "../models/user";

const OPPONENT_GOES = "OPPONENT_GOES";
const OPPONENTS_LOAD = "OPPONENTS_LOAD";
const OPPONENT_UPSERT = "OPPONENT_UPSERT";
const USER_READY = "USER_READY";
const USER_UPDATE = "USER_UPDATE";
const START_FIGHT = "START_FIGHT";

export default function(ws, { models, logger }) {
  const User = models.model("User");

  ws.on("disconnect", async () => {
    const user = await User.findOneAndUpdate(
      { socket_id: ws.id },
      { socket_id: null, status: PEACE }
    );
    logger.debug(`${user.name}(id: ${ws.id}) goes`);
    ws.broadcast.emit(OPPONENT_GOES, user.name);
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
    const opponent = await User.findOneAndUpdate(
      { status: READY, name: { $ne: ws.user.name } },
      { status: FIGHT },
      { new: true }
    );

    if (!opponent) {
      ws.user.status = READY;
      await ws.user.update({ status: READY });
      const { status, name } = ws.user;
      logger.debug(`user "${name}" ${status} to fight`);
      ws.broadcast.emit(OPPONENT_UPSERT, { name, status });
      ws.emit(USER_UPDATE, { status });
      return;
    }

    ws.user.status = FIGHT;
    await ws.user.update({ status: FIGHT });

    ws.emit(OPPONENT_UPSERT, only(opponent, "name status"));
    ws.broadcast.emit(OPPONENT_UPSERT, only(opponent, "name status"));
    ws.broadcast.emit(OPPONENT_UPSERT, only(user, "name status"));

    const my_data = only(user, "name socket_id");
    const opponent_data = only(opponent, "name socket_id");

    ws.emit(START_FIGHT, { me: my_data, opponent: opponent_data });
    ws
      .to(opponent.socket_id)
      .emit(START_FIGHT, { me: opponent_data, opponent: my_data });
  });

  //const Message = models.model("Message");
  //ws.on("chat message", async val => {
  //  const { msg, user_name } = val;
  //  const created = new Date();
  //  await Message.create({ msg, user_name, created });
  //  logger.debug(`message from ${user_name} created`);
  //  ws.broadcast.emit("chat response", { msg, user, created });
  //});
}
