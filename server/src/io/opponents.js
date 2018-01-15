import jwt from "jsonwebtoken";

const OPPONENT_GOES = "OPPONENT_OFFLINE";
const OPPONENTS_LIST_REQ = "OPPONENTS_LIST_REQ";
const OPPONENTS_LIST_RESP = "OPPONENTS_LIST_RESP";

const { JWT_SECRET } = process.env;

export default function(ws, { models, logger }) {
  const User = models.model("User");

  ws.on("disconnect", async () => {
    let user = await User.findOneAndUpdate(
      { socket_id: ws.id },
      { socket_id: null }
    );
    logger.debug(`${user.name} goes`);
    ws.broadcast.emit(OPPONENT_GOES, user.name);
  });

  ws.on(OPPONENTS_LIST_REQ, () => {
    User.find({ socket_id: { $ne: null } })
      .then(users => {
        const data = users.map(u => u.name);
        ws.emit(OPPONENTS_LIST_RESP, { data });
        logger.debug("load opponents");
      })
      .catch(err => {
        logger.debug("can't load users: " + err.message);
        ws.emit(OPPONENTS_LIST_RESP, { error: { message: err.message } });
      });
  });

  //ws.on(OPPONENT_CHALLANGE, async name => {
  //  await User.findOneAndUpdate({ name }, { accessible: true });
  //  logger.debug(`${name} is ready to challenge`);
  //});
}
