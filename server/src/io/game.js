import jwt from "jsonwebtoken";

const PEACE = "peace";
const READY = "ready";
const FIGHT = "fight";

const OPPONENT_GOES = "OPPONENT_OFFLINE";
const OPPONENTS_LIST = "OPPONENTS_LIST";
const USER_READY = "USER_READY";

export default function(ws, { models, logger }) {
  const User = models.model("User");

  ws.on("disconnect", async () => {
    const user = await User.findOneAndUpdate(
      { socket_id: ws.id },
      { socket_id: null }
    );
    logger.debug(`${user.name} goes`);
    ws.broadcast.emit(OPPONENT_GOES, user.name);
  });

  ws.on(OPPONENTS_LIST, cb => {
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
      { status: READY },
      { status: FIGHT }
    );
    if (!opponent) {
      User.updateOne({ socket_id: ws.id }, { status: READY });
      logger.debug("user ready to fight");
    }
    const user = await User.findOneAndUpdate(
      { socket_id: ws.id },
      { status: FIGHT }
    );
    logger.debug("user start to fight");
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
