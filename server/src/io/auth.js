import jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

const OPPONENT_COME = "OPPONENT_ONLINE";

export default function authIO({ logger, models }) {
  const User = models.model("User");

  return async (ws, next) => {
    try {
      const { id, handshake } = ws;
      const { name } = jwt.verify(handshake.query.token, JWT_SECRET);
      const user = await User.findOneAndUpdate({ name }, { socket_id: id });
      logger.debug(
        `authenticate new ws connection(${
          ws.nsp.name
        }). User "${name}" is coming`
      );
      ws.broadcast.emit(OPPONENT_COME, {
        name: user.name,
        status: user.status
      });
      next();
    } catch (err) {
      logger.error(`fail to authenticate new ws connection: ${err.message}`);
      next(err);
    }
  };
}
