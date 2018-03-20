import * as jwt from "jsonwebtoken";

const { JWT_SECRET } = process.env;

const ESCAPE_AUTH = ["OPPONENTS_LIST"];

export default function authIOMiddleware({ logger, models }) {
  const User = models.model("User");

  return async (ws, next) => {
    try {
      const { id, handshake } = ws;
      const { name } = jwt.verify(handshake.query.token, JWT_SECRET);
      const user = await User.findOneAndUpdate(
        { name },
        { socketId: id },
        { new: true }
      );
      if (user) {
        logger.debug(
          `io:auth - authenticate new conn(${ws.nsp.name}). User "${
            user.name
          }"-"${id} aka ${user.socketId}" is coming`
        );
        ws.user = user;
      }
      ws.use(async ([eventName], next) => {
        if (ESCAPE_AUTH.includes(eventName)) return next();
        try {
          ws.user = await User.findOne({ name, socketId: id });
          next();
        } catch (err) {
          next(err);
        }
      });
      next();
    } catch (err) {
      logger.error(`io:auth fail to authenticate new connection: ${err.stack}`);
      next(err);
    }
  };
}
